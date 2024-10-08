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
  avatarUrl: string, 
  avatarPublicId: string,
}

export async function UpdateUser({
  userId,
  name,
  username,
  bio,
  isOnboarded,
  avatarUrl,
  avatarPublicId,
}: UpdateUserParams): Promise<any> {
  try {
    await dbConnect();

    // Create the update object
    const updateData: Partial<UpdateUserParams> = {};
    if (name) updateData.name = name;
    if (username) updateData.username = username;
    if (bio) updateData.bio = bio;
    if (avatarUrl) updateData.avatarUrl = avatarUrl; 
    if (avatarPublicId) updateData.avatarPublicId = avatarPublicId; 
    if (isOnboarded !== undefined) updateData.isOnboarded = isOnboarded;

    // Ensure at least one field is provided to update
    if (!name && !username && !bio && !avatarUrl && !avatarPublicId && isOnboarded === undefined) {
      throw new Error("No fields provided to update");
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId },
      { $set: updateData },
      { upsert: false, new: true } // Ensure new updated document is returned
    );

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return { success: true, user: updatedUser };
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

// export const toggleFollowUser = async (userId: ObjectId, targetUserId: ObjectId) => {
//   try {
//     const user = await UserModel.findById(userId);
//     const targetUser = await UserModel.findById(targetUserId);

//     if (!user || !targetUser) {
//       throw new Error("User not found");
//     }

//     const isFollowing = user.following.some((id) => id.equals(targetUserId));

//     if (isFollowing) {
//       // Unfollow the user
//       user.following = user.following.filter((id) => !id.equals(targetUserId));
//       targetUser.followers = targetUser.followers.filter(
//         (id) => !id.equals(userId)
//       );
//     } else {
//       // Follow the user
//       user.following.push(targetUserId);
//       targetUser.followers.push(userId);
//     }

//     await user.save();
//     await targetUser.save();

//     if(!isFollowing){
//       await logActivity({actorId:userId,type:'follow',recipientId:targetUserId});
//     }

//     const pathToRevalidate = `/profile/${userId}`;
//     revalidatePath(pathToRevalidate);

//     return { isFollowing }
//   } catch (error: any) {
//     return { error: error.message };
//   }
// };




// get user followers

export const followUser = async (userId: ObjectId, targetUserId: ObjectId) => {
  try {
    const user = await UserModel.findById(userId);
    const targetUser = await UserModel.findById(targetUserId);

    if (!user || !targetUser) {
      throw new Error("User not found");
    }

    // Check if already following
    const isAlreadyFollowing = user.following.some((id) => id.equals(targetUserId));
    if (isAlreadyFollowing) {
      throw new Error("Already following this user");
    }

    // Add to following list of user and to followers list of targetUser
    user.following.push(targetUserId);
    targetUser.followers.push(userId);

    await user.save();
    await targetUser.save();

    // Log follow activity
    await logActivity({ actorId: userId, type: 'follow', recipientId: targetUserId });

    // Revalidate the profile path
    const pathToRevalidate = `/profile/${userId}`;
    revalidatePath(pathToRevalidate);

    return { success: true, message: "Followed successfully" };
  } catch (error: any) {
    return { error: error.message };
  }
};


export const unfollowUser = async (userId: ObjectId, targetUserId: ObjectId) => {
  try {
    const user = await UserModel.findById(userId);
    const targetUser = await UserModel.findById(targetUserId);

    if (!user || !targetUser) {
      throw new Error("User not found");
    }

    // Check if user is following
    const isFollowing = user.following.some((id) => id.equals(targetUserId));
    if (!isFollowing) {
      throw new Error("Not following this user");
    }

    // Remove from following list of user and from followers list of targetUser
    user.following = user.following.filter((id) => !id.equals(targetUserId));
    targetUser.followers = targetUser.followers.filter((id) => !id.equals(userId));

    await user.save();
    await targetUser.save();

    // Revalidate the profile path
    const pathToRevalidate = `/profile/${userId}`;
    revalidatePath(pathToRevalidate);

    return { success: true, message: "Unfollowed successfully" };
  } catch (error: any) {
    return { error: error.message };
  }
};


export async function getFollowers(userId: string, pageNumber: number) {
  dbConnect();

  try {
    const pageSize = 5;
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
    const pageSize = 5;
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
