import { Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { adminConfig } from '../../config/env';
import { User } from '../../domain/entities/user';
import { JWTService } from '../../infrastructure/security/jwt';
import { ApiResponse } from '../../infrastructure/dtos/common.dts';
import { OTPService } from '../../infrastructure/service/otpService';
import { handleUseCaseError } from '../../infrastructure/error/useCaseError';
import { PasswordHasher } from '../../infrastructure/security/passwordHasher';
import { SignedUrlService } from '../../infrastructure/service/generateSignedUrl';
import { UserRepositoryImpl } from '../../infrastructure/database/user/userRepositoryImpl';
import { CheckUserStatusRequest, CheckUserStatusResponse, LoginRequest, LoginResponse, OTPVerificationRequest, RegisterRequest, RegisterResponse, ResendOtpRequest, ResendOtpResponse } from '../../infrastructure/dtos/auth.dto';

export class RegisterUseCase {
  constructor(
    private userRepositoryImpl: UserRepositoryImpl
  ) { }

  async execute(data: RegisterRequest): Promise<RegisterResponse> {
    try {
      const { email, password, fullName, role } = data;

      const existingUser = await this.userRepositoryImpl.findUserByEmailWithRole(email,role);
      if (existingUser?.isVerified) throw new Error("User already exists with this email");

      const hashedPassword = await PasswordHasher.hashPassword(password);

      const verificationToken = uuidv4();
      if (!verificationToken) throw new Error("Unexpected error, please try again.");

      const otp = await OTPService.setOtp(verificationToken);
      if (!otp) throw new Error("Unexpected error, please try again.");

      await OTPService.sendOTP(email, otp);

      if (existingUser) {
        existingUser.verificationToken = verificationToken;
        existingUser.password = hashedPassword;
        await this.userRepositoryImpl.updateUser(existingUser as User);
      } else {
        await this.userRepositoryImpl.createUser({
          fullName: fullName,
          email: email,
          password: hashedPassword,
          verificationToken: verificationToken,
          role: role
        });
      }

      const token = JWTService.generateToken({ email, role });

      return { success: true, message: `OTP sent to email`, user: { verificationToken, role, token } };
    } catch (error) {
      throw handleUseCaseError(error || "Unexpected error in VerifyOTPUseCase");
    }
  }
}

export class VerifyOTPUseCase {
  constructor(private userRepository: UserRepositoryImpl) { }

  async execute(data: OTPVerificationRequest): Promise<ApiResponse> {
    try {
      const { otp, verificationToken, role } = data;
      if (!otp || !verificationToken || !role) throw new Error("Invalid request.");

      const user = await this.userRepository.verifyUser(verificationToken);
      if (!user) throw new Error("Verification failed, please try again");

      const isValidOTP = await OTPService.verifyOTP(verificationToken, otp);
      if (!isValidOTP) throw new Error("Invalid or expired OTP.");

      user.isVerified = true;
      await this.userRepository.updateUser(user);

      return { success: true, message: 'OTP verified successfully.' };
    } catch (error) {
      throw handleUseCaseError(error || "Unexpected error in VerifyOTPUseCase");
    }
  }
}


export class ResendOtpUseCase {

  constructor(private userRepositoryImpl: UserRepositoryImpl) { }

  async execute(data: ResendOtpRequest): Promise<ResendOtpResponse> {
    try {

      const { role, verificationToken, email } = data;
      if (!role || (!verificationToken && !email)) throw new Error("Invalid request.");

      let user: User | null = null;

      if (email && role) {
        if (role === "user") {
          user = await this.userRepositoryImpl.findUserByEmailWithRole(email,role);
        }

      } else if (verificationToken && role) {
        user = await this.userRepositoryImpl.verifyUser(verificationToken);
      } else {
        throw new Error("Invalid request.");
      }

      if (!user || !user?.email || !user?.verificationToken) throw new Error("Please register.")

      const otp = await OTPService.setOtp(user?.verificationToken);
      if (!otp) throw new Error("Unexpected error, please try again.");

      await OTPService.sendOTP(user?.email, otp);

      return { success: true, message: `OTP sent to email.`, user: { verificationToken: user.verificationToken, role } };
    } catch (error) {
      throw handleUseCaseError(error || "Unexpected error in VerifyOTPUseCase");
    }
  }
}


export class LoginUseCase {
  constructor(
    private userRepositoryImpl: UserRepositoryImpl,
    private signedUrlService: SignedUrlService
  ) { }

  async execute(data: LoginRequest): Promise<LoginResponse> {
    try {
      console.log("data : ",data);
      const { email, password, role } = data;
      if (!email || !password || !role) throw new Error("Invalid request.");

      // validateOrThrow("email", email);
      // validateOrThrow("password", password);
      // validateOrThrow("role", role);

      let user: User | null = null;

      if (role === "user" || role === "admin" || role === "superAdmin") { // TODO need to ahandle admin
        user = await this.userRepositoryImpl.findUserByEmailWithRole(email,role);
      } else if (role === "systemAdmin") {
        if (email !== adminConfig.adminEmail || password !== adminConfig.adminPassword) {
          throw new Error("Invalid credentials.");
        }
        const token = JWTService.generateToken({ email: email, role: role });
        return { success: true, message: "Logged In Successfully.", user: { fullName: "Super Admin", profileImage: "", role: role, token } };
      } else {
        throw new Error("Invalid request.");
      }

      if (!user) throw new Error("Invalid credentials")

      if (user.isBlocked) throw new Error("Your account is blocked, please contact us.");
      if (!user.isVerified) throw new Error("Your registration was incomplete, please register again.");

      const valid = await PasswordHasher.comparePassword(password, user.password);

      if (!valid) throw new Error("Invalid credentials.");

      const token = JWTService.generateToken({ userId: user._id, role: role });

      let updateProfileImage;

      if (user.profileImage) {
        const userOrProviderProfileUrl = user.profileImage;
        if (!userOrProviderProfileUrl) throw new Error("Profile image fetching error.");
        const urlParts = userOrProviderProfileUrl?.split('/');
        if (!urlParts) throw new Error("UrlParts error.");
        const s3Key = urlParts.slice(3).join('/');
        if (!s3Key) throw new Error("Image retrieving.");
        const signedUrl = await this.signedUrlService.generateSignedUrl(s3Key);
        if (!signedUrl) throw new Error("Image fetching error.");
        updateProfileImage = signedUrl
      }

      return {
        success: true, message: 'Logged In Successfully.', user: {
          _id: user._id,
          fullName: user.fullName,
          profileImage: updateProfileImage ? updateProfileImage : user.profileImage,
          role: role,
          token,
        }
      };
    } catch (error) {
      throw handleUseCaseError(error || "Unexpected error in VerifyOTPUseCase");
    }
  }
}


export class CheckUserStatusUseCase {
  constructor(private userRepository: UserRepositoryImpl) { }

  async execute(data: CheckUserStatusRequest): Promise<CheckUserStatusResponse> {
    const { id } = data;

    // Validator.validateObjectId(id);
    // Validator.validateRole(role);

    const user = await this.userRepository.findUserById(new Types.ObjectId(id));
    if (user?.isBlocked) {
      return { status: 403, success: false, message: "Your account has been blocked." };
    } else {
      return { status: 200, success: true, message: "Your account is active." };
    }

  }
}

