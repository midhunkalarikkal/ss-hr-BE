import { v4 as uuidv4 } from 'uuid';
import type { User } from "../../domain/entities/user";
import { JWTService } from '../../infrastructure/security/jwt';
import { OTPService } from '../../infrastructure/service/otpService';
import { PasswordHasher } from '../../infrastructure/security/passwordHasher';
import { OTPVerificationRequest, RegisterRequest, RegisterResponse } from '../../infrastructure/dtos/auth.dto';
import { UserRepositoryImpl } from '../../infrastructure/database/user/userRepositoryImpl';
import { ApiResponse } from '../../infrastructure/dtos/common.dts';


export class RegisterUseCase {
  constructor(
    private userRepositoryImpl: UserRepositoryImpl
  ) { }

  async execute(data: RegisterRequest): Promise<RegisterResponse> {
    try {
      const { email, password, fullName, role } = data;
      const existingUser = await this.userRepositoryImpl.findUserByEmail(email);
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
      console.log("RegisterUseCase error : ", error);
      throw new Error("RegisterUseCase error");
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
      
      return { success: true, message: 'OTP verified successfully.' };
    } catch (error) {
      console.log("VerifyOTPUseCase error : ", error);
      throw new Error("VerifyOTPUseCase error");
    }
  }
}
