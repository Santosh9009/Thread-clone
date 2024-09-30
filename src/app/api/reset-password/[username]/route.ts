import dbConnect from "@/lib/dbConnect";
import UserModel from "@/lib/Model/User";
import { UsernameSchema } from "@/ZodSchema/ValidationSchema";
import bcrypt from "bcryptjs"; // Make sure you have bcrypt installed
import { NextRequest } from "next/server";

export async function POST(request: NextRequest,{params}:{params:{username:string}}) {
  try {
    const paramUsername = params.username;

    await dbConnect();

    const { resetToken, password } = await request.json();
    console.log(resetToken,password,paramUsername)

    // Validate the username with the schema
    const result = UsernameSchema.safeParse({ username: paramUsername });

    if (!result.success) {
      return Response.json(
        {
          message: "Invalid username parameters",
          success: false,
        },
        { status: 403 }
      );
    }

    // Find the user by username and ensure they are verified
    const user = await UserModel.findOne({
      username: paramUsername,
      isVerified: true,
    });

    if (!user) {
      return Response.json(
        {
          message: "User doesn't exist",
          success: false,
        },
        { status: 404 }
      );
    }

    // Check if the resetToken matches and verify the token has not expired
    if (!user.resetToken || user.resetToken !== resetToken) {
      return Response.json(
        {
          message: "Invalid reset token",
          success: false,
        },
        { status: 409 }
      );
    }

    if (!user.resetTokenExpiry || new Date() > user.resetTokenExpiry) {
      return Response.json(
        {
          message: "Reset token has expired",
          success: false,
        },
        { status: 409 }
      );
    }

    // Hash the new password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    // Clear the resetToken and its expiry date after password reset
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    return Response.json(
      {
        message: "Password reset successful",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error resetting password:", error);
    return Response.json(
      {
        message: "Internal server error",
        success: false,
      },
      { status: 500 }
    );
  }
}
