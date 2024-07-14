import mongoose, { Document, Schema } from 'mongoose';

interface RepostType extends Document {
  user: mongoose.Types.ObjectId;
  thread: mongoose.Types.ObjectId;
  createdAt: Date;
}

const repostSchema: Schema<RepostType> = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  thread: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Thread',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Repost =mongoose.models.Repost as mongoose.Model<RepostType>|| mongoose.model<RepostType>('Repost', repostSchema);

export default Repost;
