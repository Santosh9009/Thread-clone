"use server";
import ThreadModel from "@/lib/Model/Thread";
import dbConnect from "../dbConnect";
import UserModel from "@/lib/Model/User";
import { revalidatePath } from "next/cache";
import mongoose, { model } from "mongoose";
import { ObjectId } from "mongodb";
import { logActivity } from "./activity.actions";

// create thread
interface createParams {
  content: string;
  author: string;
  photos?: { url: string | null; publicId: string | null}[]; 
  videos?: { url: string | null; publicId: string | null }[]; 
}

export async function createThread({
  content,
  author,
  photos = [],   
  videos = [],   
}: createParams): Promise<any> {
  try {
    // Connect to the database
    await dbConnect();

      await ThreadModel.create({
      author,
      content,
      photos,  
      videos,  
    });

    // Revalidate the necessary paths (home and profile pages)
    revalidatePath("/");
    revalidatePath("/profile");

    // Return the created thread
    return { success:true };
  } catch (error) {
    // Handle any errors that occur during thread creation
    throw new Error("Error creating thread: " + error);
  }
}


// fetch all threads
// export async function fetchallThreads(
//   pageNumber: number,
// ): Promise<any> {
//   try {
//     await dbConnect();
//     console.log("DB connected");

//     const pageSize:number = 5;

//     const skipAmount = (pageNumber - 1) * pageSize;
//     console.log(`Skipping ${skipAmount} documents`);

//     const postsfetch = ThreadModel.find({
//       parentId: { $in: [null, undefined] },
//     })
//       .sort({ createdAt: "desc" })
//       .skip(skipAmount)
//       .limit(pageSize)
//       .populate({
//         path: "author",
//         model: UserModel,
//       })
//       .populate({
//         path: "comments",
//         populate: {
//           path: "author",
//           model: UserModel,
//           select: "_id username parentId avatarUrl",
//         },
//       }).populate({
//         path:"reposts",
//         model:RepostModel,
//         select:'author content'
//       })

//     const posts = await postsfetch.exec();

//     const totalPosts = await ThreadModel.countDocuments({
//       parentId: { $in: [null, undefined] },
//     });

//     const isNext = totalPosts > skipAmount + posts.length;

//     if (!postsfetch) {
//       throw new Error("No posts found!");
//     }

//     const allposts = JSON.parse(JSON.stringify({ posts, isNext }));

//     return { allposts };
//   } catch (error: any) {
//     console.error("Unable to fetch threads:", error.message);
//     throw new Error("Unable to fetch threads: " + error.message);
//   }
// }

export async function fetchAllThreads(pageNumber: number): Promise<any> {
  try {
    await dbConnect();
    console.log("DB connected");

    const pageSize: number = 4;
    const skipAmount = (pageNumber - 1) * pageSize;
    console.log(`Skipping ${skipAmount} documents`);

    const posts = await ThreadModel.find({
      parentId: { $in: [null, undefined] },
    })
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({ path: "author", model: UserModel })
      .populate({
        path: "comments",
        populate: {
          path: "author",
          model: UserModel,
          select: "_id username parentId avatarUrl",
        },
      })
      .populate({ path: "reposts", model: ThreadModel, select: "author" })
      .populate({
        path: "originalThread",
        model: ThreadModel,
        populate: [
          { path: "reposts", model: ThreadModel, select: "author" },
          { path: "author", model: UserModel, select: "username avatarUrl" },
          {
            path: "originalThread",
            model: ThreadModel,
            populate: [
              { path: "author", model: UserModel, select: "username avatarUrl" },
            ],
          },
        ],
      })
      .exec();

    const totalPosts = await ThreadModel.countDocuments({
      parentId: { $in: [null, undefined] },
    });
    const isNext = totalPosts > skipAmount + posts.length;

    // console.log(`Fetched ${posts.length} posts`);
    // console.log(`Total posts: ${totalPosts}`);
    // console.log(`Is there a next page? ${isNext}`);

    return { posts: JSON.parse(JSON.stringify(posts)), isNext };
  } catch (error: any) {
    console.error("Unable to fetch threads:", error.message);
    throw new Error("Unable to fetch threads: " + error.message);
  }
}

interface commnetparams {
  threadId: ObjectId;
  commentText: string;
  author: string;
  path: string;
}

// add a comment
export async function addCommnet({
  threadId,
  commentText,
  author,
  path,
}: commnetparams) {
  dbConnect();

  try {
    const originalThread = await ThreadModel.findById(threadId);

    if (!originalThread) {
      throw new Error("thread doesn't exists");
    }

    const comment = new ThreadModel({
      author: author,
      content: commentText,
      parentId: threadId,
    });

    const savedComment = await comment.save();

    // @ts-ignore
    originalThread.comments.push(savedComment._id);

    await originalThread.save();
    await logActivity({
      actorId: author,
      type: "comment",
      recipientId: originalThread.author._id,
      threadId: threadId,
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error("Uable to post comment" + error.message);
  }
}

// get thread by id
export async function getThread(threadId: ObjectId) {
  dbConnect();

  try {
    const thread = await ThreadModel.findById(threadId)
      .populate("author", "_id username avatarUrl")
      .populate({
        path: "originalThread",
        model: ThreadModel,
        populate: [
          { path: "reposts", model: ThreadModel, select: "author" },
          { path: "author", model: UserModel, select: "_id username" },
          {
            path: "originalThread",
            model: ThreadModel,
            populate: [
              { path: "author", model: UserModel, select: "username" },
            ],
          },
          {
            path: "comments",
            populate: [
              {
                path: "author",
                model: UserModel,
                select: "_id username avatarUrl",
              },
              {
                path: "comments",
                populate: {
                  path: "author",
                  model: UserModel,
                  select: "_id username avatarUrl",
                },
              },
            ],
          },
        ],
      })
      .populate({
        path: "comments",
        populate: [
          {
            path: "author",
            model: UserModel,
            select: "_id username avatarUrl",
          },
          {
            path: "comments",
            populate: {
              path: "author",
              model: UserModel,
              select: "_id username avatarUrl",
            },
          },
        ],
      });

    if (!thread) {
      throw new Error("Thread not found");
    }
    const post = JSON.parse(JSON.stringify({ thread }));

    return { post };
  } catch (error: any) {
    throw new Error("error getting the thread", error.message);
  }
}

export async function UserThreads(userId: ObjectId, pageNumber: number) {
  dbConnect();

  try {
    const pageSize = 2;
    const skipAmount = (pageNumber - 1) * pageSize;

    const Threads = await ThreadModel.find({
      parentId: { $in: [null, undefined] },
      author: userId,
      isRepost: { $in: [false, null, undefined] },
    })
      .populate({
        path: "author",
        model: UserModel,
        select: "username _id avatarUrl",
      })
      .populate({
        path: "originalThread",
        model: ThreadModel,
        populate: { path: "author", model: UserModel, select: "username _id avatarUrl" },
      })
      .limit(pageSize)
      .skip(skipAmount)
      .sort({ createdAt: "desc" })
      .exec();

    return { userThreads: JSON.parse(JSON.stringify(Threads)) };
  } catch (error: any) {
    throw new Error("Error fetching user threads");
  }
}

export async function UserComments(userId: ObjectId, pageNumber: number) {
  dbConnect();

  try {
    const pageSize = 2;
    const skipAmount = (pageNumber - 1) * pageSize;

    const comment = await ThreadModel.find({
      parentId: { $nin: [null] },
      author: userId,
    })
    . populate({path:'author',model:UserModel,select:'username _id avatarUrl'})
      .populate({
        path: "parentId",
        model: ThreadModel,
        populate: [
          { path: "reposts", model: ThreadModel, select: "author" },
          { path: "author", model: UserModel, select: "username _id avatarUrl" },
          {
            path: "originalThread",
            model: ThreadModel,
            populate: [
              { path: "author", model: UserModel, select: "username _id avatarUrl" },
            ],
          },
        ],
        
      })
      .sort({ createdAt: "desc" })
      .limit(pageSize)
      .skip(skipAmount)
      .exec();

    return { comments: JSON.parse(JSON.stringify(comment)) };
  } catch (error: any) {
    throw new Error("Error fetching user comments");
  }
}

// like thread
interface liketype {
  threadId: any;
  userId: string;
}
export async function togglelike({ threadId, userId }: liketype) {
  dbConnect();
  try {
    const thread = await ThreadModel.findOne({ _id: threadId });

    if (!thread) {
      throw new Error("No thread found");
    }
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const UserIndex = thread.likes.indexOf(userObjectId);

    if (UserIndex == -1) {
      thread.likes.push(userObjectId);
      // log Activity
      await logActivity({
        actorId: userId,
        type: "like",
        recipientId: thread.author._id,
        threadId: threadId,
      });
    } else {
      thread.likes.splice(UserIndex, 1);
    }

    await thread.save();

    return true;
  } catch (error) {
    throw new Error("Unable toogle like" + error);
  }
}

// repost a thread 
export async function repostThread(originalThread: ObjectId, author: ObjectId) {
  dbConnect();
  try {
    const repost = await ThreadModel.create({
      parentId: null,
      author,
      isRepost: true,
      originalThread,
    });

    const oldthread = await ThreadModel.findOneAndUpdate(
      { _id: originalThread },
      {
        $push: { reposts: repost._id },
      }
    );

    if (originalThread) {
      await logActivity({
        actorId: author,
        type: "repost",
        recipientId: oldthread?.author._id,
        originalThreadId: originalThread,
        threadId: repost._id,
      });
    }

    console.log(originalThread);

    revalidatePath("/");

    return { success: true };
  } catch (error: any) {
    throw new Error("Error reposting" + error);
  }
}

// remove repost
export async function removeRepostThread(
  originalThread: ObjectId,
  author: ObjectId
) {
  dbConnect(); // Connect to your database

  try {
    // Find the repost thread
    const repost = await ThreadModel.findOne({
      originalThread,
      author,
      isRepost: true,
    });

    if (!repost) {
      throw new Error("Repost not found");
    }

    // Remove the repost reference from the original thread's reposts array
    await ThreadModel.findOneAndUpdate(
      { _id: originalThread },
      {
        $pull: { reposts: repost._id },
      }
    );

    // Delete the repost thread itself
    const deletedRepost = await ThreadModel.findByIdAndDelete(repost._id);

    revalidatePath("/");

    return { success: true };
  } catch (error: any) {
    throw new Error("Error removing repost: " + error);
  }
}

// get thread for quote
export async function getThreadbyId(threadId: any) {
  dbConnect();
  try {
    const post = await ThreadModel.findOne({ _id: threadId }).populate({
      path: "author",
      model: UserModel,
      select: "username",
    });

    const thread = JSON.parse(JSON.stringify({ post }));

    return { thread };
  } catch (error: any) {
    throw new Error("Unable to fetch thread");
  }
}

// Quote thread

// export async function QuoteThread(
//   originalThread: ObjectId,
//   author: ObjectId,
//   content: string
// ) {
//   dbConnect();
//   try {
//     const quote = await ThreadModel.create({
//       parentId: null,
//       author,
//       isQuote: true,
//       originalThread,
//       content,
//     });

//     const oldthread = await ThreadModel.findOneAndUpdate(
//       { _id: originalThread },
//       {
//         $push: { Quotes: quote._id },
//       }
//     );

//     if (originalThread) {
//       await logActivity({
//         actorId: author,
//         type: "quote",
//         recipientId:oldthread?.author._id,
//         originalThreadId: originalThread,
//         threadId: quote._id,
//       });
//     }

//     revalidatePath("/");

//     return { success: true };
//   } catch (error: any) {
//     throw new Error("Error quoting" + error);
//   }
// }

export async function QuoteThread(
  originalThread: ObjectId,
  author: ObjectId,
  content: string,
  photos?: { url: string; publicId: string }[] // Change here to allow an array of photos
) {
  dbConnect();
  try {
    const quoteData: any = {
      parentId: null,
      author,
      isQuote: true,
      originalThread,
      content,
    };

    // If photos are provided, add them to the quote data
    if (photos) {
      quoteData.photos = photos;
    }

    const quote = await ThreadModel.create(quoteData);

    const oldThread = await ThreadModel.findOneAndUpdate(
      { _id: originalThread },
      {
        $push: { Quotes: quote._id },
      }
    );

    if (originalThread) {
      await logActivity({
        actorId: author,
        type: "quote",
        recipientId: oldThread?.author._id,
        originalThreadId: originalThread,
        threadId: quote._id,
      });
    }

    revalidatePath("/");

    return { success: true };
  } catch (error: any) {
    throw new Error("Error quoting: " + error.message);
  }
}


export async function getUserReposts(userId: ObjectId, pageNumber: number) {
  dbConnect();
  try {
    const pageSize = 4;
    const skipAmount = (pageNumber - 1) * pageSize;

    const reposts = await ThreadModel.find({
      author: userId,
      isRepost: true,
    })
      .populate({path:"author",model:UserModel,select: "_id username avatarUrl"})
      .populate({
        path: "originalThread",
        model: ThreadModel,
        populate: [
          { path: "reposts", model: ThreadModel, select: "author" },
          { path: "author", model: UserModel, select: "_id username avatarUrl" },
          {
            path: "originalThread",
            model: ThreadModel,
            populate: { path: "author", model: UserModel, select: "username avatarUrl" },
          },
        ],
      })
      .sort({ createdAt: "desc" })
      .limit(pageSize)
      .skip(skipAmount)
      .exec();

    return { Reposts: JSON.parse(JSON.stringify(reposts)) };
  } catch (error: any) {
    throw new Error("Unable to get user reposts");
  }
}


export async function deleteThread(threadId:any){
  dbConnect();
  try{
    const thread = await ThreadModel.findOneAndDelete()

  }catch(error:any){
    throw new Error("Error deleting thread"+error)
  }
}