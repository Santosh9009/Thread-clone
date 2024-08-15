import mongoose, { Schema, Document } from "mongoose";

export interface ActivityType extends Document {
  actor: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  type: string;
  originalthread?: mongoose.Types.ObjectId;
  thread?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const ActivitySchema: Schema<ActivityType> = new Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["like", "comment", "repost", "follow", "quote"],
      required: true,
      index: true,
    },
    thread: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
      default: null,
      index: true,
    },
    originalthread: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const ActivityModel =
  (mongoose.models?.Activity as mongoose.Model<ActivityType>) ||
  mongoose.model<ActivityType>("Activity", ActivitySchema);

export default ActivityModel;
