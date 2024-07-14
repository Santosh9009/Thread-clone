import UserModel from "@/lib/Model/User";
import { verifySchema } from "@/ZodSchema/ValidationSchema";
import dbConnect from "@/lib/dbConnect";
import { NextRequest } from "next/server";

export async function POST(request:NextRequest,{params}:{params:{name:string}}){
  try{
    await dbConnect();
    const username = params.name;
    const { verifyCode } = await request.json();
    console.log(verifyCode)

    const result = verifySchema.safeParse({verifyCode});
    if(!result.success){
      return Response.json({
        success:false,
        message:"Invalid parameters"
      },{
        status:400
      })
    }

    const user = await UserModel.findOne({username})
    if(!user){
      return Response.json({
        success:false,
        message:"User not found",
      },{status:404})
    }


    if(user){

     if(user?.verifyCode === verifyCode){
      user.isVerified = true;
      await user?.save();
      return Response.json({
        success:true,
          message:"Email verified Successfully",
      },{status:200})

    }else{
      return Response.json({
        success:false,
          message:"Invalid Verification Code",
      },{status:401})
    }

  }
    


  }catch{
    return Response.json({
      success:false,
      message:"Unable to verify email"
    },{
      status:500
    })
  }
}