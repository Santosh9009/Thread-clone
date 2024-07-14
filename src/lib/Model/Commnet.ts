import mongoose, { Document, Schema } from 'mongoose';

interface CommentType extends Document {
  content: string;
  author: mongoose.Types.ObjectId;
  thread: mongoose.Types.ObjectId;
  createdAt: Date;
  likes: mongoose.Types.ObjectId[];
}

const commentSchema: Schema<CommentType> = new Schema({
  content: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
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
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
});

const Comment = (mongoose.models.Comment as mongoose.Model<CommentType>) || (mongoose.model<CommentType>('Comment', commentSchema));

export default Comment;
