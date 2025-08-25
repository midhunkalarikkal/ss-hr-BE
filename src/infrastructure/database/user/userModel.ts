import { Role } from '../../../domain/entities/user';
import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  fullName: string;
  email: string;
  password: string;
  role: Role;
  phoneOne: string;
  phoneTwo: string;
  profileImage: string;
  isVerified: boolean;
  isBlocked: boolean;
  verificationToken: string;
  googleId: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  fullName: {
    type: String,
    required: [true, "FullName is required"],
    minlength: [4, "FullName must be at least 4 characters"],
    maxlength: [30, "FullName must be at most 30 characters"],
    trim: true,
    match: [/^[a-zA-Z\s]{4,30}$/, "Invalid username"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters"],
    maxlength: [100, "Password must be at most 100 characters"],
    match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,100}$/, "Invalid password"]
  },
  role: {
    type: String,
    required: [true, "role is required"],
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  phoneOne: {
    type: String,
    default: null,
    minlength: [7, "Phone number must be at least 7 characters"],
    maxlength: [20, "Phone number must be at most 20 characters"],
    match: [/^\+?[0-9\s\-().]{7,20}$/, "Invalid phone number. Only digits, spaces, dashes (-), dots (.), parentheses (), and an optional + at the beginning are allowed. Length must be between 7 to 20 characters."],
  },
  phoneTwo: {
    type: String,
    default: null,
    minlength: [7, "Phone number must be at least 7 characters"],
    maxlength: [20, "Phone number must be at most 20 characters"],
    match: [/^\+?[0-9\s\-().]{7,20}$/, "Invalid phone number. Only digits, spaces, dashes (-), dots (.), parentheses (), and an optional + at the beginning are allowed. Length must be between 7 to 20 characters."],
  },
  profileImage: {
    type: String,
    default: null
  },
  verificationToken: {
    type: String,
    default: null
  },
  googleId: {
    type: String,
    default: null
  },
}, {
  timestamps: true
});

export const UserModel = mongoose.model<IUser>('User', UserSchema);
