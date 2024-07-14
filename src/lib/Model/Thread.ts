import mongoose, { Schema , Document} from "mongoose";

export interface ThreadType extends Document{
  parentId?: mongoose.Types.ObjectId;
  content: string;
  author: mongoose.Types.ObjectId;
  createdAt: Date;
  likes: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
  reposts: mongoose.Types.ObjectId[];
}

const ThreadSchema: Schema<ThreadType> = new Schema({
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Thread",
    default: null,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  reposts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Thread",
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Thread",
  }],
});


const ThreadModel = (mongoose.models.Thread as mongoose.Model<ThreadType>) || (mongoose.model<ThreadType>("Thread", ThreadSchema));

export default ThreadModel;
