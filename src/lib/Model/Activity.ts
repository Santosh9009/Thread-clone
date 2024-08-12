import mongoose, { Schema, Document } from "mongoose";

export interface ActivityType extends Document {
  actor: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  type: string;
  thread?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const ActivitySchema: Schema<ActivityType> = new Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["like", "comment", "repost", "follow", "quote"],
      required: true,
    },
    thread: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
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
