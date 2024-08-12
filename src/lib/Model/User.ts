import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
  name: string;
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  followers: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
  bio: string;
  avatarUrl: string;
  createdAt: Date;
  isOnboarded: boolean;
  threads: mongoose.Types.ObjectId[];
}

const UserSchema: Schema<User> = new Schema({
  name: {
    type: String,
    // required:[true,'Name required'],
  },
  username: {
    type: String,
    required: [true, "Username required"],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "email required"],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "use valid email"],
    trim: true,
  },
  password: {
    type: String,
    required: [true, "password required"],
    minlength: 5,
  },
  verifyCode: {
    type: String,
    required: [true, "verifyCode required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  bio: {
    type: String,
    trim: true,
  },
  avatarUrl: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  isOnboarded: {
    type: Boolean,
    default: false,
  },
  threads: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Thread",
  }],
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});


const UserModel = (mongoose.models?.User as mongoose.Model<User>) || (mongoose.model<User>("User", UserSchema));

export default UserModel;
