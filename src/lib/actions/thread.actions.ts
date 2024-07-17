"use server";
import ThreadModel, { ThreadType } from "@/lib/Model/Thread";
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
  } catch (error:any) {
    console.error("Unable to fetch threads:", error.message);
    throw new Error("Unable to fetch threads: " + error.message);
  }
}

export async function getThread() {}


interface commnetparams{
  threadId:string,
  commentText:string,
  author:string,
  path:string
}

export async function addCommnet({threadId,commentText,author,path}:commnetparams){

  dbConnect()
  
  try{
    const originalThread = await ThreadModel.findById(threadId);

    if(!originalThread){
      throw new Error("thread doesn't exists")
    }

    const comment = new ThreadModel({
      author:author,
      content:commentText,
      parentId:threadId
    })

    const savedComment = await comment.save();

    // @ts-ignore
    originalThread.comments.push(savedComment._id)

    await originalThread.save()

    revalidatePath(path);


  }catch(error:any){
    throw new Error("Uable to post comment"+ error.message)
  }
}
