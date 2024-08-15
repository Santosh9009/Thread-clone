import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import ActivityModel from "../Model/Activity";
import UserModel from "../Model/User";
import dbConnect from "../dbConnect";
import ThreadModel from "../Model/Thread";
import { revalidatePath } from "next/cache";

interface LogActivityOptions {
  actorId: any;
  type: "follow" | "like" | "comment" | "repost" | "quote";
  recipientId?: any;
  threadId?: any;
  originalThreadId?: any;
}

export async function logActivity({
  actorId,
  type,
  recipientId,
  threadId,
  originalThreadId,
}: LogActivityOptions) {
  await dbConnect();
  try {
    let recipient = null;
    console.log(originalThreadId);

    if (!recipientId && originalThreadId) {
      recipient = await ThreadModel.findById(originalThreadId);
    }

    await ActivityModel.create({
      originalthread: originalThreadId,
      actor: actorId,
      recipient: recipientId || recipient?.author._id || null,
      type,
      thread: threadId,
    });

    revalidatePath("/activity");
  } catch (error) {
    console.error("Error logging activity:", error);
  }
}

export async function getUserActivities(
  userId: mongoose.Types.ObjectId,
  pageNumber: number
) {
  await dbConnect();
  try {
    const PageSize = 10;
    const skipAmount = (pageNumber - 1) * PageSize;

    const query = await ActivityModel.find({
      recipient: userId,
      actor: { $ne: userId },
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "actor",
        model: UserModel,
        select: "username _id",
      })
      .populate({
        path: "recipient",
        model: UserModel,
        select: "username _id",
      })
      .limit(PageSize)
      .skip(skipAmount)
      .exec();

    return { activities: JSON.parse(JSON.stringify(query)) };
  } catch (error: any) {
    throw new Error("Error getting user Activity");
  }
}
