"use server";
import ThreadModel from "@/lib/Model/Thread";
import dbConnect from "../dbConnect";
import UserModel from "@/lib/Model/User";
import { revalidatePath } from "next/cache";
import { json } from "stream/consumers";

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

    return { newThread };
    revalidatePath(path);
  } catch (error) {
    throw new Error("Error creating thread" + error);
  }
}

interface fetchthreadTypes {
  pageNumber: number;
  pageSize: number;
}

export async function fetchallThreads(pageNumber:number,pageSize:number): Promise<any> {
  try {
    await dbConnect();
    console.log("DB connected");

    const skipAmount = (pageNumber - 1) * pageSize;
    console.log(`Skipping ${skipAmount} documents`);

    const postsfetch = ThreadModel.find({ parentId: { $in: [null, undefined] } })
    .sort({createdAt: "desc"})
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
    console.log("posts"+posts)

    const totalPosts = await ThreadModel.countDocuments({
      parentId: { $in: [null, undefined] },
    });
   

    const isNext = totalPosts > skipAmount + posts.length;

    if(!postsfetch){
      throw new Error("No posts found!")
    }

    const allposts = JSON.parse(JSON.stringify({posts,isNext}))

    return { allposts };
  } catch (error) {
    console.error("Unable to fetch threads:", error);
    throw new Error("Unable to fetch threads: " + error);
  }
}

export async function getThread() {}
