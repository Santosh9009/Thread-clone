import { sendResetPasswordEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/lib/Model/User";
import { emailSchema } from "@/ZodSchema/ValidationSchema";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { email } = await request.json();


    const result = emailSchema.safeParse({ email });
    if (!result.success) {
      return new Response(
        JSON.stringify({
          message: "Invalid email format",
        }),
        { status: 400 }
      );
    }

    
    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      return new Response(
        JSON.stringify({ message: "User does not exist" }),
        { status: 404 } 
      );
    }


    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    
    existingUser.resetToken = resetToken;
    existingUser.resetTokenExpiry = expiryDate;
    await existingUser.save();


    const emailResponse = await sendResetPasswordEmail(
      email,
      existingUser.username,
      resetToken
    );

    if (!emailResponse.success) {
      return new Response(
        JSON.stringify({
          message: "Error sending reset password email",
        }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Reset password email sent successfully",
      }),
      { status: 200 }
    );

  } catch (error) {
    console.log("Error resetting password", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to reset password",
      }),
      { status: 500 }
    );
  }
}
