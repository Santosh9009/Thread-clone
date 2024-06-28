import UserModel from "@/Model/User";
import { UsernameSchema } from "@/ZodSchema/ValidationSchema";
import dbConnect from "@/lib/dbConnect";
import { NextRequest } from "next/server";

export async function GET(request:NextRequest,{params}:{params:{name:string}}){
  try{
    await dbConnect();
    const username = params.name;

    const result = UsernameSchema.safeParse(username);
    if(!result.success){
      return Response.json({
        success:false,
        message:"Invalid username parameters"
      },{
        status:400
      })
    }

    await UserModel.updateOne({username},{isVerified:true})
    return Response.json({
      success:true,
        message:"Email verified Successfully",
    },{status:200})


  }catch{
    return Response.json({
      success:false,
      message:"Unable to verify email"
    },{
      status:500
    })
  }
}