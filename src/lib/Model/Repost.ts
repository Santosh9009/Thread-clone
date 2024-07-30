import mongoose, { Schema, Document } from "mongoose";

export interface RepostType extends Document {
  originalThread: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  content?: string;
  createdAt: Date;
  likes: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
}

const RepostSchema: Schema<RepostType> = new Schema({
  originalThread: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Thread",
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Thread",
  }],
});

const RepostModel = mongoose.models.Repost as mongoose.Model<RepostType> ||
  mongoose.model<RepostType>("Repost", RepostSchema);

export default RepostModel;
