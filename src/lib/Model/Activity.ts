import mongoose, { Document, Schema, Model } from "mongoose";

// Define the interface for the Activity document
interface ActivityType extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  type: string;
  details: Record<string, unknown>;
  createdAt?: Date;
}

// Define the Activity schema
const ActivitySchema: Schema<ActivityType> = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true }, // e.g., 'create_thread', 'post_comment', 'like_post'
  details: { type: mongoose.Schema.Types.Mixed, required: true }, // JSON object for additional details
  createdAt: { type: Date, default: Date.now }
});

// Define the Activity model
const Activity = mongoose.models.Activity as Model<ActivityType> || mongoose.model<ActivityType>('Activity', ActivitySchema);

export default Activity;
