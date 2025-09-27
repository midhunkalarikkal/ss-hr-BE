import { Types } from "mongoose";
import { Request, Response } from "express";
import { DecodedUser } from "../../express";
import {
  LoginZodSchema,
  RegisterZodSchema,
  ResendOTPZodSchema,
  OTPVerificationZodSchema,
} from "../../infrastructure/zod/auth.zod";
import {
  LoginUseCase,
  RegisterUseCase,
  ResendOtpUseCase,
  VerifyOTPUseCase,
  CheckUserStatusUseCase,
} from "../../application/authUse-cases/authUseCases";
import { appConfig, aws_s3Config } from "../../config/env";
import { HandleError } from "../../infrastructure/error/error";
import { SignedUrlService } from "../../infrastructure/service/generateSignedUrl";
import { GoogleAuthUseCase } from "../../application/authUse-cases/googleAuthUseCase";
import { UserRepositoryImpl } from "../../infrastructure/database/user/userRepositoryImpl";
import { SignedUrlRepositoryImpl } from "../../infrastructure/database/signedUrl/signedUrlRepositoryImpl";

const userRepositoryImpl = new UserRepositoryImpl();
const signedUrlRepositoryImpl = new SignedUrlRepositoryImpl();

const signedUrlService = new SignedUrlService(aws_s3Config.bucketName, signedUrlRepositoryImpl); const registerUseCase = new RegisterUseCase(userRepositoryImpl);
const verifyOTPUseCase = new VerifyOTPUseCase(userRepositoryImpl);
const resendOtpUseCase = new ResendOtpUseCase(userRepositoryImpl);
const loginUseCase = new LoginUseCase(userRepositoryImpl, signedUrlService);
const checkUserStatusUseCase = new CheckUserStatusUseCase(userRepositoryImpl);
const googleAuthUseCase = new GoogleAuthUseCase(userRepositoryImpl);

export class AuthController {
  constructor(
    private registerUseCase: RegisterUseCase,
    private verifyOTPUseCase: VerifyOTPUseCase,
    private resendOtpUseCase: ResendOtpUseCase,
    private loginUseCase: LoginUseCase,
    private checkUserStatusUseCase: CheckUserStatusUseCase,
    private googleAuthUseCase: GoogleAuthUseCase
  ) {
    this.register = this.register.bind(this);
    this.verifyOTP = this.verifyOTP.bind(this);
    this.resendOtp = this.resendOtp.bind(this);
    this.login = this.login.bind(this);
    this.checkUserStatus = this.checkUserStatus.bind(this);
    this.googleCallback = this.googleCallback.bind(this);
  }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const validateData = RegisterZodSchema.parse(req.body);
      const result = await this.registerUseCase.execute(validateData);

      res.cookie("token", result.user.token, {
        httpOnly: true,
        secure: appConfig.nodeEnv === "development",
        sameSite: appConfig.nodeEnv === "development" ? "none" : "lax",
        maxAge: 2 * 24 * 60 * 60 * 1000,
        path: "/",
      });

      const { token: token, ...authUserWithoutToken } = result.user;
      const resultWithoutToken = {
        ...result,
        user: authUserWithoutToken,
      };
      res.status(200).json(resultWithoutToken);
    } catch (error) {
      console.log("error : ", error);
      HandleError.handle(error, res);
    }
  };

  async verifyOTP(req: Request, res: Response) {
    try {
      const validateData = OTPVerificationZodSchema.parse(req.body);
      const { otp, verificationToken, role } = validateData;
      if (!otp || !verificationToken || !role)
        throw new Error("Invalid request.");
      const result = await this.verifyOTPUseCase.execute({
        otp,
        verificationToken,
        role,
      });
      res.status(200).json(result);
    } catch (error) {
      HandleError.handle(error, res);
    }
  }

  async resendOtp(req: Request, res: Response) {
    try {
      const validateData = ResendOTPZodSchema.parse(req.body);
      const { role, verificationToken, email } = validateData;
      if (!role || (!verificationToken && !email))
        throw new Error("Invalid request.");
      const result = await this.resendOtpUseCase.execute({
        role,
        verificationToken,
        email,
      });
      res.status(200).json(result);
    } catch (error) {
      HandleError.handle(error, res);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const validateData = LoginZodSchema.parse(req.body);
      const { email, password, role } = validateData;
      if (!email || !password || !role) throw new Error("Invalid request.");
      const { success, message, user } = await this.loginUseCase.execute({
        email,
        password,
        role,
      });

      res.cookie("token", user.token, {
        httpOnly: true,
        secure: appConfig.nodeEnv === "development",
        sameSite: appConfig.nodeEnv === "development" ? "none" : "lax",
        maxAge: 2 * 24 * 60 * 60 * 1000,
        path: "/",
      });

      const { token: token, ...authUserWithoutToken } = user;
      const resultWithoutToken = {
        success,
        message,
        user: authUserWithoutToken,
      };
      res.status(200).json(resultWithoutToken);
    } catch (error) {
      console.log("error : ", error);
      HandleError.handle(error, res);
    }
  }

  async logout(req: Request, res: Response) {
    try {
      res.clearCookie("token");
      res
        .status(200)
        .json({ success: true, message: "Logged out successfully." });
    } catch (error) {
      HandleError.handle(error, res);
    }
  }

  async checkUserStatus(req: Request, res: Response) {
    try {
      const user = (req.user as DecodedUser);
      if (!user) throw new Error("User not found");
      const result = await this.checkUserStatusUseCase.execute({
        id: new Types.ObjectId(user.userId),
        role: user.role,
      });
      res.status(result.status).json(result);
    } catch (error) {
      HandleError.handle(error, res);
    }
  }


  // solve the redirected to home page
  async googleCallback(req: Request, res: Response) {
    try {
      if (!req.user) {
        const frontendUrl = appConfig.frontendUrl;
        return res.redirect(`${frontendUrl}/login?error=google_auth_failed`);
      }

      const result = await this.googleAuthUseCase.execute(req.user as any);

      res.cookie("token", result.user.token, {
        httpOnly: true,
        secure: appConfig.nodeEnv === "development",
        sameSite: appConfig.nodeEnv === "development" ? "none" : "lax",
        maxAge: 2 * 24 * 60 * 60 * 1000,
        path: "/",
      });

      const frontendUrl =  appConfig.frontendUrl;
      res.redirect(`${frontendUrl}/`);
    } catch (error) {
      console.log("Google auth error:", error);
      const frontendUrl =  appConfig.frontendUrl;
      res.redirect(`${frontendUrl}/login?error=google_auth_failed`);
    }
  }
}


const authController = new AuthController(
  registerUseCase,
  verifyOTPUseCase,
  resendOtpUseCase,
  loginUseCase,
  checkUserStatusUseCase,
  googleAuthUseCase
);

export { authController };
