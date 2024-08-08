"use server";
import ThreadModel from "@/lib/Model/Thread";
import dbConnect from "../dbConnect";
import UserModel from "@/lib/Model/User";
import { revalidatePath } from "next/cache";
import mongoose, { model } from "mongoose";
import { ObjectId } from "mongodb";
import RepostModel from "../Model/Repost";

// create thread
interface createParams {
  content: string;
  author: string;
  path: string;
}

export async function createThread({
  content,
  author,
  path,
}: createParams): Promise<any> {
  try {
    await dbConnect();

    const newThread = await ThreadModel.create({
      author,
      content,
    });

    revalidatePath("/");
    revalidatePath("/profile");

    return { newThread };
  } catch (error) {
    throw new Error("Error creating thread" + error);
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
      .populate({ path: "reposts", model: ThreadModel, select: "author " })
      .populate({
        path: "originalThread",
        model: ThreadModel,
        populate: [
          { path: "reposts", model: ThreadModel, select: "author" },
          { path: "author", model: UserModel, select: "username" },
          {
            path: "originalThread",
            model: ThreadModel,
            populate: [
              { path: "author", model: UserModel, select: "username" },
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
          { path: "author", model: UserModel, select: "username" },
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

export async function UserThreads(userId: ObjectId) {
  dbConnect();

  try {
    const userThreads = await ThreadModel.find({
      parentId: { $in: [null, undefined] },
      author: userId,
      isRepost: { $in: [null, undefined] },
    })
      .populate({
        path: "author",
        model: UserModel,
        select: "username",
      })
      .sort({ createdAt: "desc" })
      .exec();

    // const userThreads = JSON.parse(JSON.stringify({Threads}))

    return { userThreads };
  } catch (error: any) {
    throw new Error("Error fetching user threads");
  }
}

export async function UserComments(userId: ObjectId) {
  dbConnect();

  try {
    const comments = await ThreadModel.find({
      parentId: { $nin: [null] },
      author: userId,
    })
      .populate({
        path: "parentId",
        model: ThreadModel,
        populate: {
          path: "author",
          model: UserModel,
        },
      })
      .sort({ createdAt: "desc" });

    // const comments = JSON.parse(JSON.stringify({comment}))

    return { comments };
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
    } else {
      thread.likes.splice(UserIndex, 1);
    }

    await thread.save();

    return true;
  } catch (error) {
    throw new Error("Unable toogle like" + error);
  }
}

// repost a thread or
export async function repostThread(originalThread: ObjectId, author: ObjectId) {
  dbConnect();
  try {
    const repost = await ThreadModel.create({
      parentId: null,
      author,
      isRepost: true,
      originalThread,
    });

    await ThreadModel.findOneAndUpdate(
      { _id: originalThread },
      {
        $push: { reposts: repost._id },
      }
    );

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

export async function QuoteThread(
  originalThread: ObjectId,
  author: ObjectId,
  content: string
) {
  dbConnect();
  try {
    const quote = await ThreadModel.create({
      parentId: null,
      author,
      isQuote: true,
      originalThread,
      content,
    });

    await ThreadModel.findOneAndUpdate(
      { _id: originalThread },
      {
        $push: { Quotes: quote._id },
      }
    );

    revalidatePath("/");

    return { success: true };
  } catch (error: any) {
    throw new Error("Error quoting" + error);
  }
}

export async function getUserReposts(userId: ObjectId) {
  dbConnect();
  try {
    const reposts = await ThreadModel.find({
      author: userId,
      isRepost: true,
    })
      .populate("author", "_id username avatarUrl")
      .populate({
        path: "originalThread",
        model: ThreadModel,
        populate: [
          { path: "author", model: UserModel, select: "_id username" },
          { path: "comments", model: ThreadModel },
          {
            path: "originalThread",
            model: ThreadModel,
            populate: { path: "author", model: UserModel, select: "username" },
          },
        ],
      })
      .exec();

    return { allReposts: JSON.parse(JSON.stringify({ reposts })) };
  } catch (error: any) {
    throw new Error("Unable to get user reposts");
  }
}
