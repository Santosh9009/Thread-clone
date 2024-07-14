"use server"
import ThreadModel from "@/lib/Model/Thread";
import dbConnect from "../dbConnect";
import UserModel from "@/lib/Model/User";
import { revalidatePath } from "next/cache";

interface createParams {
  content: string;
  author: string;
  path: string;
}

export async function createThread({
  content,
  author,
  path
}: createParams): Promise<any> {
  try {
    await dbConnect();

    const newThread = await ThreadModel.create({
      author,
      content,
    });

    return {newThread};
    revalidatePath(path)

  } catch (error) {
    throw new Error("Error creating thread" + error);
  }
}

export async function fetchallThreads(pageNumber = 1, pageSize = 20) {
  dbConnect();

  const skipAmount = (pageNumber - 1) * pageSize;

  const postsfetch = ThreadModel.find({ parentId: { $in: [null, undefined] } })
    .sort("desc")
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

  return { posts, isNext };
}

export async function getThread() {}
