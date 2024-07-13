import ThreadModel from "@/Model/Thread";
import dbConnect from "../dbConnect";
import UserModel from "@/Model/User";

interface createParams {
  content: string;
  author: string;
  path: string;
}

export async function createThread({ content, author, path }: createParams) {
  try {
    dbConnect();

    const newThread = await ThreadModel.create({
      author,
      content,
    });

    return {newThread}
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
      path: "children",
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
