import mongoose,{ ObjectId,Document } from 'mongoose';

export interface User {
  threads: ObjectId[];
  _id: ObjectId;
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  followers: ObjectId[];
  following: ObjectId[];
  createdAt: Date;
  __v: number;
  bio: string;
  name: string;
  isOnboarded: boolean;
}

export interface PostType {
  _id: ObjectId;
  parentId?: PostType | null;
  content: string;
  author: {
    _id: ObjectId;
    username: string;
  };
  createdAt: Date;
  likes: any[];
  comments: any[];
  reposts: any[];
  isRepost: boolean;
  originalThread?: any
}


export interface CommentType extends Document{
  parentId?: mongoose.Types.ObjectId;
  content: string;
  author: mongoose.Types.ObjectId;
  createdAt: Date;
  likes: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
  reposts: mongoose.Types.ObjectId[];
}

export interface CommentThread {
  _id: string;
  author: User;
  content: string;
  comments: CommentThread[];
  likes: User[];
  reposts: User[];
  createdAt: Date;
}

export interface ThreadsType {
  _id: string;
  author: User;
  content: string;
  comments: CommentThread[];
  likes: User[];
  reposts: User[];
  createdAt: Date;
}