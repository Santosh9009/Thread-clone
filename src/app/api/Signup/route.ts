import UserModel from "@/Model/User";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import bcrypt from "bcryptjs";

async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    const ExistingUserbyUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (ExistingUserbyUsername) {
      return Response.json({
        success: false,
        status: 400,
        message: "User already exists",
      });
    }

    const ExistingUserbyemail = await UserModel.findOne({
      email,
    });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (ExistingUserbyemail) {
      if (ExistingUserbyemail.isVerified) {
        return Response.json({
          status: 400,
          message: "User already exists",
          success:false,
        });
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
      const emailResponse = await sendVerificationEmail(email,username,password);
      
      if(!emailResponse.success){
        return Response.json({
          messgae:"error sending email",
          success:false,
          status:500,
        })
      }

      return Response.json({
        messgae:"User registered successfully, please verify your email",
        success:true,
        status:200,
      })

  } catch (error) {
    console.log("Error singning up");
    return Response.json({
      status: 500,
      success: false,
      message: "Failed to signup",
    });
  }
}
