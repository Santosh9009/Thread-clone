import mongoose, { Schema } from "mongoose";

interface Threadtype {
  content?: string;
  author: mongoose.Types.ObjectId;
  createdAt: Date;
  likes: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
  reposts: mongoose.Types.ObjectId[];
}

const ThreadSchema : Schema<Threadtype> = new Schema({
  content:{
    type:String,
    required:true,
    trim:true,
  },
  author:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
  },
  createdAt:{
    type:Date,
    default:Date.now()
  },
  likes:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
  }],
  reposts:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
  }],
  comments:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
  }],
})

const ThreadModel = (mongoose.models.Thread as mongoose.Model<Threadtype>) || (mongoose.model<Threadtype>("Thread",ThreadSchema) ) 

export default ThreadModel

