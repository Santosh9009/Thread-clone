"use server";
import ThreadModel from "@/lib/Model/Thread";
import dbConnect from "../dbConnect";
import UserModel from "@/lib/Model/User";
import { revalidatePath } from "next/cache";
import mongoose, { ObjectId } from "mongoose";

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

    revalidatePath(path);

    return { newThread };
  } catch (error) {
    throw new Error("Error creating thread" + error);
  }
}

// fetch all threads
export async function fetchallThreads(
  pageNumber: number,
  pageSize: number
): Promise<any> {
  try {
    await dbConnect();
    console.log("DB connected");

    const skipAmount = (pageNumber - 1) * pageSize;
    console.log(`Skipping ${skipAmount} documents`);

    const postsfetch = ThreadModel.find({
      parentId: { $in: [null, undefined] },
    })
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({
        path: "author",
        model: UserModel,
      })
      .populate({
        path: "comments",
        populate: {
          path: "author",
          model: UserModel,
          select: "_id name parentId avatarUrl",
        },
      });

    const posts = await postsfetch.exec();

    const totalPosts = await ThreadModel.countDocuments({
      parentId: { $in: [null, undefined] },
    });

    const isNext = totalPosts > skipAmount + posts.length;

    if (!postsfetch) {
      throw new Error("No posts found!");
    }

    const allposts = JSON.parse(JSON.stringify({ posts, isNext }));

    return { allposts };
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
      .populate("author", "_id name avatarUrl")
      .populate({
        path: "comments",
        populate: [
          {
            path: "author",
            model: UserModel,
            select: "_id name avatarUrl",
          },
          {
            path: "comments",
            populate: {
              path: "author",
              model: UserModel,
              select: "_id name avatarUrl",
            },
          },
        ],
      });

    if (!thread) {
      throw new Error("Thread not found");
    }
    const post = JSON.parse(JSON.stringify({ thread }));
    console.log(post.thread);

    return { post };
  } catch (error: any) {
    throw new Error("error getting the thread", error.message);
  }
}

export async function UserThreads(userId: string) {
  dbConnect();

  try {
    const userThreads = await ThreadModel.find({
      author: {
        _id: userId,
      },
    });

    return {userThreads};
  } catch (error: any) {
    throw new Error("Error fetching user threads");
  }
}

export async function UserComments(userId: string) {
  dbConnect();

  try {
    const userComments = ThreadModel.find({
      parentId : { $nin: [null] },
      author: userId,
    }).populate({
      path: 'parentId',
      model: ThreadModel,
    });

    const comments = await userComments.exec();
    console.log(comments);

    return {comments};
  } catch (error: any) {
    throw new Error("Error fetching user comments");
  }
}

// like thread
interface liketype {
  threadId:any,
  userId:string,
}
export async function togglelike({threadId,userId}:liketype) {
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
    console.log(thread);

    return true;
  } catch (error) {
    throw new Error("Unable toogle like"+error);
  }
}
