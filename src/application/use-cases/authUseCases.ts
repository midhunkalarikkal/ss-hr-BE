import { v4 as uuidv4 } from 'uuid';
import type { User } from "../../domain/entities/user";
import { JWTService } from '../../infrastructure/security/jwt';
import { OTPService } from '../../infrastructure/service/otpService';
import { PasswordHasher } from '../../infrastructure/security/passwordHasher';
import { RegisterRequest, RegisterResponse } from '../../infrastructure/dtos/auth.dto';
import { UserRepositoryImpl } from '../../infrastructure/database/user/userRepositoryImpl';


export class RegisterUseCase {
  constructor(
    private userRepositoryImpl: UserRepositoryImpl
  ) { }
  
  async execute(data: RegisterRequest): Promise<RegisterResponse> {
    try {
    console.log("data : ",data);
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

    } catch(error) {
      console.log("RegisterUseCase error : ",error);
      throw new Error("RegisterUseCase error");
    }
  }
}

