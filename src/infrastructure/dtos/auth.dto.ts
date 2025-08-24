import { Types } from "mongoose";
import { User } from "../../domain/entities/user";
import { ApiResponse, CommonResponse } from "./common.dts";

// Register usecase
export type RegisterRequest = Pick<User, "fullName" | "email" | "password" | "role">
export interface RegisterResponse extends CommonResponse {
  user: Pick<User, "verificationToken" | "role"> & {
    token: string;
  }
}

// Verify Otp
export interface OTPVerificationRequest {
    otp: string;
    verificationToken: string;
    role: string;
}

// Resend otp
export interface ResendOtpResponse extends ApiResponse {
  user: {
    verificationToken: string, 
    role: string 
  }
}
export interface ResendOtpRequest {
    role: string;
    verificationToken?: string;
    email?: string;
}

// Login
export interface LoginRequest {
    email: string;
    password: string;
    role: string;
}
export interface LoginResponse extends CommonResponse {
    user: { 
        _id?: Types.ObjectId;
        fullName: string, 
        profileImage: string | null, 
        role: string, 
        token: string, 
    }
}


// Check Auth
export interface CheckUserStatusRequest {
    id: Types.ObjectId;
    role: string;
}
export interface CheckUserStatusResponse extends CommonResponse {
    status: number;
}