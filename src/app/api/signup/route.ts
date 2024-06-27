import UserModel from "@/Model/User";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { username, email, password } = await request.json();

    const ExistingUserbyUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (ExistingUserbyUsername) {
      return Response.json({
        success: false,
        message: "User already exists",
      },{status: 400,});
    }

    const ExistingUserbyemail = await UserModel.findOne({
      email,
    });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (ExistingUserbyemail) {
      if (ExistingUserbyemail.isVerified) {
        return Response.json({
          message: "User already exists",
          success:false,
        },{status: 400});
      } else {
        const hashedPasword = await bcrypt.hash(password, 10);
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);

        ExistingUserbyemail.password = hashedPasword,
        ExistingUserbyemail.verifyCodeExpiry = expiryDate,
        ExistingUserbyemail.verifyCode = verifyCode,

        await ExistingUserbyemail.save();
      }
    } else {
      const hashedPasword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newuser = new UserModel({
        username,
        email,
        password: hashedPasword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        Messages: [],
      });
      await newuser.save();
    }

    // send verification email
      const emailResponse = await sendVerificationEmail(email,username,verifyCode);
      
      if(!emailResponse.success){
        return Response.json({
          messgae:"error sending email",
          success:false,
        },{status:500,})
      }

      return Response.json({
        messgae:"User registered successfully, please verify your email",
        success:true,
      },{status:200,})

  } catch (error) {
    console.log("Error singning up");
    return Response.json({
      success: false,
      message: "Failed to signup",
    },{status: 500,});
  }
}
