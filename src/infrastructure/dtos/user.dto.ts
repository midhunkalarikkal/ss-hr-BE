import { Types } from "mongoose";
import { Role } from "../../domain/entities/user";

export interface CreateUserByAdminRequest {
  fullName: string;
  email: string;
  password: string;
  role: Role;
  phone?: string;
  phoneTwo?: string;
}

export interface CreateUserByAdminResponse {
  success: boolean;
  message: string;
  user: {
    _id: Types.ObjectId;
    serialNumber: string;
    fullName: string;
    email: string;
    role: Role;
  };
}

export interface UpdateUserRequest {
  _id: Types.ObjectId;
  fullName?: string;
  email?: string;
  phone?: string;
  phoneTwo?: string;
  isBlocked?: boolean;
  isVerified?: boolean;
}

export interface UpdateUserResponse {
  success: boolean;
  message: string;
  user?: {
    _id: Types.ObjectId;
    serialNumber: string;
    fullName: string;
    email: string;
    role: Role;
    isBlocked: boolean;
    isVerified: boolean;
  };
}

export interface DeleteUserRequest {
  userId: Types.ObjectId;
}

export interface GetUserByIdRequest {
  userId: Types.ObjectId;
}

export interface GetUserByIdResponse {
  success: boolean;
  message: string;
  user: {
    _id: Types.ObjectId;
    serialNumber: string;
    fullName: string;
    email: string;
    role: Role;
    phone: string;
    phoneTwo: string;
    profileImage: string;
    isBlocked: boolean;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
}