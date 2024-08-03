"use server";
import UserModel from "@/lib/Model/User";
import dbConnect from "../dbConnect";
import { ObjectId } from "mongodb";
import { FilterQuery, model } from "mongoose";


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
    const user = await UserModel.findById(id);

    if (!user) {
      throw new Error("no user found");
    }

    const res = JSON.parse(JSON.stringify({user}))

    return {res};
  } catch (error: any) {
    throw new Error("Uable to fetch user" + error.message);
  }
}

interface filterType {
  userId: ObjectId;
  pageNumber?: number;
  pageSize?: number;
  searchText: string;
}

export async function filterUser({
  pageNumber = 1,
  pageSize = 10,
  userId,
  searchText,
}: filterType) {
  dbConnect();

  try {
    const skipAmount = (pageNumber - 1) * pageSize;

    const regex = new RegExp(searchText, "i");

    const query: FilterQuery<typeof UserModel> = { id: { $ne: userId } };

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

    return { res: JSON.parse(JSON.stringify( {users} )),isNext};
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
      targetUser.followers = targetUser.followers.filter((id) => !id.equals(userId));
    } else {
      // Follow the user
      user.following.push(targetUserId);
      targetUser.followers.push(userId);
    }

    await user.save();
    await targetUser.save();

    return {
      message: isFollowing
        ? true
        : false,
    };
  } catch (error: any) {
    return { error: error.message };
  }
};

export default toggleFollowUser;
