import { ApiResponse, CommonResponse } from "./common.dts";
import { User } from "../../domain/entities/user";

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
