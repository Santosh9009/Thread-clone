"use server"
import UserModel from "@/lib/Model/User";
import dbConnect from "../dbConnect";

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
  isOnboarded
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
      { upsert: false}
    );

    if (!updatedUser) {
      throw new Error("User not found");
    }

    const plainUser = updatedUser.toObject();

    return plainUser;

  } catch (error: any) {
    throw new Error("Failed to update user: " + error.message);
  }
}


export async function getUser(id:string){
  dbConnect();

  try{
    const user = await UserModel.findById(id);

    if(!user){
      throw new Error("no user found")
    }

    return user;
  }catch(error:any){
    throw new Error("Uable to fetch user"+error.message)
  }
}