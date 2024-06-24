import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema : Schema<Message> = new Schema({
  content: {
    type:String,
    required:true
  },
  createdAt: {
    type:Date,
    required:true,
    default:Date.now()
  }
})

export interface User extends Document {
  username:string,
  email:string,
  password:string,
  verifyCode:string,
  verifyCodeExpiry:Date,
  isVerified:boolean,
  isAcceptingMessage:boolean,
  Messages:Message[],
}

const UserSchema : Schema<User> = new Schema({
  username:{
    type:String,
    required:[true,"Username required"],
    unique:true,
  },
  email:{
    type:String,
    required:[true,"email required"],
    unique:true,
    match:[/^\S+@\S+\.\S+$/,"use valid email"]
  },
  password:{
    type:String,
    required:[true,"email required"],
    minlength:5
  },
  verifyCode:{
    type:String,
    required:[true,"verifyCode required"],
  },
  verifyCodeExpiry:{
    type:Date,
    required:true,
  },
  isAcceptingMessage:{
    type: Boolean,
    default:true,
  },
  isVerified:{
    type:Boolean,
    default:false,
  },
  Messages:[MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User",UserSchema))

export default UserModel;