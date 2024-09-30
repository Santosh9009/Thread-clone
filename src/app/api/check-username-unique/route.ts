import UserModel from "@/lib/Model/User";
import { UsernameSchema } from "@/ZodSchema/ValidationSchema";
import dbConnect from "@/lib/dbConnect";
import { NextRequest } from "next/server";

export async function POST(request:NextRequest){
  
  try{
    const searchParams = request.nextUrl.searchParams
    const paramUsername = searchParams.get('username');

    await dbConnect();

    const result = UsernameSchema.safeParse({username:paramUsername})

    if(!result.success){
      return Response.json({
        message:"Invalid username parameters",
        success:false,
      },{status:403})
    }


    const user = await UserModel.findOne({
      username:paramUsername,
      isVerified:true,
    })

    if(user){
        return Response.json({
          message:"username is already taken",
          success:false,
        },{status:405})
    }
    
    return Response.json({
      message:"username is unique",
      success:true,
    },{status:200})
    
  }catch(error){
    return Response.json({
      message:"Internal server error",
      success:false,
    },{status:500})
  }
}