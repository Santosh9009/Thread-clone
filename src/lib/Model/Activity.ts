import mongoose, { Schema, Document } from "mongoose";

export interface Activity extends Document {
  actor: mongoose.Types.ObjectId; // The user who performed the action
  recipient: mongoose.Types.ObjectId; // The user who is the target of the action
  type: string; // "like", "comment", "repost", "follow"
  thread?: mongoose.Types.ObjectId; // Optional, relevant for actions like "like", "comment", "repost"
  createdAt: Date;
}

const ActivitySchema: Schema<Activity> = new Schema({
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
    enum: ["like", "comment", "repost", "follow"],
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
});

const ActivityModel = mongoose.models.Activity as mongoose.Model<Activity> || mongoose.model<Activity>("Activity", ActivitySchema);

export default ActivityModel;
