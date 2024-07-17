import { ObjectId } from 'mongodb';

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
  parentId: ObjectId | null;
  content: string;
  author: User;
  likes: ObjectId[];
  reposts: ObjectId[];
  comments: ObjectId[];
  createdAt: Date;
  __v: number;
}