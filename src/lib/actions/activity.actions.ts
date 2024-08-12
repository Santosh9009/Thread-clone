import mongoose from "mongoose";
import ActivityModel from "../Model/Activity";
import UserModel from "../Model/User";
import dbConnect from "../dbConnect";

async function logActivity(
  actorId: any,
  recipientId: any,
  type: "follow" | "like" | "comment" | "repost" | "quote",
  threadId?: any
) {
  await dbConnect();
  try {
    await ActivityModel.create({
      actor: actorId,
      recipient: recipientId,
      type,
      thread: threadId || null,
    });

  } catch (error) {
    console.error("Error logging activity:", error);
  }
}

export default logActivity;

export async function getUserActivities(
  userId: mongoose.Types.ObjectId,
  pageNumber: number
) {
  await dbConnect();
  try {
    const PageSize = 2;
    const skipAmount = (pageNumber - 1) * PageSize;

    const query = await ActivityModel.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "actor",
        model: UserModel,
        select: "username",
      })
      .limit(PageSize)
      .skip(skipAmount)
      .exec();

 
    return { activities:JSON.parse(JSON.stringify(query)) };
  } catch (error: any) {
    throw new Error("Error getting user Activity");
  }
}
