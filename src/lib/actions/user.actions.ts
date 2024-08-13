"use server";
import UserModel from "@/lib/Model/User";
import dbConnect from "../dbConnect";
import { ObjectId } from "mongodb";
import { FilterQuery, model } from "mongoose";
import {logActivity} from "./activity.actions";
import { revalidatePath } from "next/cache";

interface UpdateUserParams {
  userId: string;
  name?: string;
  username?: string;
  bio?: string;
  isOnboarded: boolean;
}

export async function UpdateUser({
  userId,
  name,
  username,
  bio,
  isOnboarded,
}: UpdateUserParams): Promise<any> {
  try {
    await dbConnect();

    // Create the update object
    const updateData: Partial<UpdateUserParams> = {};
    if (name) updateData.name = name;
    if (username) updateData.username = username;
    if (bio) updateData.bio = bio;

    // Ensure at least one field is provided to update
    if (!name && !username && !bio && isOnboarded === undefined) {
      throw new Error("No fields provided to update");
    }

    updateData.isOnboarded = isOnboarded;

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId },
      { $set: updateData },
      { upsert: false }
    );

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return { success: true };
  } catch (error: any) {
    throw new Error("Failed to update user: " + error.message);
  }
}

export async function getUser(id: ObjectId) {
  dbConnect();

  try {
    const User = await UserModel.findById(id);

    if (!User) {
      throw new Error("no user found");
    }

    return { user: JSON.parse(JSON.stringify(User)) };
  } catch (error: any) {
    throw new Error("Uable to fetch user" + error.message);
  }
}

interface filterType {
  userId: ObjectId;
  pageNumber?: number;
  searchText: string;
}

export async function filterUser({
  pageNumber = 1,
  userId,
  searchText,
}: filterType) {
  dbConnect();

  try {
    const pageSize = 10;

    const skipAmount = (pageNumber - 1) * pageSize;

    const regex = new RegExp(searchText, "i");

    const query: FilterQuery<typeof UserModel> = { _id: { $ne: userId } };

    if (searchText.trim() !== "") {
      query.$or = [
        { name: { $regex: regex } },
        { username: { $regex: regex } },
      ];
    }

    const userQuery = UserModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skipAmount)
      .limit(pageSize);

    const users = await userQuery.exec();

    const totalUsers = await UserModel.countDocuments(query);

    const isNext = totalUsers > skipAmount + users.length;

    return { res: JSON.parse(JSON.stringify({ users })), isNext };
  } catch (error: any) {
    throw new Error("Error searching user" + error.message);
  }
}

const toggleFollowUser = async (userId: ObjectId, targetUserId: ObjectId) => {
  try {
    const user = await UserModel.findById(userId);
    const targetUser = await UserModel.findById(targetUserId);

    if (!user || !targetUser) {
      throw new Error("User not found");
    }

    const isFollowing = user.following.some((id) => id.equals(targetUserId));

    if (isFollowing) {
      // Unfollow the user
      user.following = user.following.filter((id) => !id.equals(targetUserId));
      targetUser.followers = targetUser.followers.filter(
        (id) => !id.equals(userId)
      );
    } else {
      // Follow the user
      user.following.push(targetUserId);
      targetUser.followers.push(userId);
    }

    await user.save();
    await targetUser.save();

    if(!isFollowing){
      await logActivity({actorId:userId,type:'follow',recipientId:targetUserId});
    }

    const pathToRevalidate = `/profile/${userId}`;
    revalidatePath(pathToRevalidate);

    return {
      message: isFollowing ? true : false,
    };
  } catch (error: any) {
    return { error: error.message };
  }
};

export default toggleFollowUser;


// get user followers
export async function getFollowers(userId: string, pageNumber: number) {
  dbConnect();

  try {
    const pageSize = 2;
    const skipAmount = (pageNumber - 1) * pageSize;

    const user = await UserModel.findById(userId)
      .populate({
        path: "followers",
        model: UserModel,
        options:{
          skip:skipAmount,
          limit:pageSize
        },
        match:{
          _id:{$ne:userId}
        }
      })
      .exec();

    if (!user) {
      throw new Error("User not found");
    }

    const followers = user.followers;


    return { Followers: JSON.parse(JSON.stringify(followers)) };
  } catch (error: any) {
    throw new Error("Unable to get followers");
  }
}


// get user following
export async function getFollowings(userId: string, pageNumber: number) {
  dbConnect();

  try {
    const pageSize = 1;
    const skipAmount = (pageNumber - 1) * pageSize;

    const user = await UserModel.findById(userId)
      .populate({
        path: "following",
        model: UserModel,
        options:{
          skip:skipAmount,
          limit:pageSize
        },
        match:{
          _id:{$ne:userId}
        }
      })
      .exec();

    if (!user) {
      throw new Error("User not found");
    }

    const followings = user.following;


    return { Followings: JSON.parse(JSON.stringify(followings)) };
  } catch (error: any) {
    throw new Error("Unable to get followers");
  }
}
