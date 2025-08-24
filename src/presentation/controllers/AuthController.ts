import { Request, Response} from 'express';
import { appConfig } from '../../config/env';
import { HandleError } from '../../infrastructure/error/error';
import { LoginZodSchema, OTPVerificationZodSchema, RegisterZodSchema, ResendOTPZodSchema } from '../../infrastructure/zod/auth.zod';
import { LoginUseCase, RegisterUseCase, ResendOtpUseCase, VerifyOTPUseCase } from '../../application/use-cases/authUseCases';
import { UserRepositoryImpl } from '../../infrastructure/database/user/userRepositoryImpl';

const userRepositoryImpl = new UserRepositoryImpl();
const registerUseCase = new RegisterUseCase(userRepositoryImpl);
const verifyOTPUseCase = new VerifyOTPUseCase(userRepositoryImpl);
const resendOtpUseCase = new ResendOtpUseCase(userRepositoryImpl);
const loginUseCase = new LoginUseCase(userRepositoryImpl);

export class AuthController {

  constructor(
    private registerUseCase: RegisterUseCase,
    private verifyOTPUseCase: VerifyOTPUseCase,
    private resendOtpUseCase: ResendOtpUseCase,
    private loginUseCase: LoginUseCase,
  ) {
    this.register = this.register.bind(this);
    this.verifyOTP = this.verifyOTP.bind(this);
    this.resendOtp = this.resendOtp.bind(this);
    this.login = this.login.bind(this);
  }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const validateData = RegisterZodSchema.parse(req.body);
      const result = await this.registerUseCase.execute(validateData);
       res.cookie("token", result.user.token, {
        maxAge: 2 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'none',
        secure: appConfig.nodeEnv !== 'development'
      });

      const { token: token, ...authUserWithoutToken } = result.user;
      const resultWithoutToken = {
        ...result,
        user: authUserWithoutToken,
    };
    res.status(200).json(resultWithoutToken);
    } catch (error) {
      console.log("error : ",error);
      HandleError.handle(error, res);
    };

  }

   async verifyOTP(req: Request, res: Response) {
    try {
      const validateData = OTPVerificationZodSchema.parse(req.body);
      const { otp, verificationToken, role } = validateData;
      if (!otp || !verificationToken || !role) throw new Error("Invalid request.");
      const result = await this.verifyOTPUseCase.execute({otp, verificationToken, role});
      res.status(200).json(result);
    } catch (error) {
      HandleError.handle(error, res);
    }
  }

   async resendOtp(req: Request, res: Response) {
    try {
      const validateData = ResendOTPZodSchema.parse(req.body);
      const { role, verificationToken, email } = validateData;
      if (!role || (!verificationToken && !email)) throw new Error("Invalid request.");
      const result = await this.resendOtpUseCase.execute({role, verificationToken, email});
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
      const { success, message, user } = await this.loginUseCase.execute({email, password, role});
      res.cookie("token", user.token, {
        maxAge: 2 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'none',
        secure: appConfig.nodeEnv !== 'development'
      });
      const { token: token, ...authUserWithoutToken } = user;
      const resultWithoutToken = {
        success, message,
        user: authUserWithoutToken,
      };
      res.status(200).json(resultWithoutToken);
    } catch (error) {
      console.log("error : ",error);
      HandleError.handle(error, res);
    }
  }

  async logout(req: Request, res: Response) {
    try {
      res.clearCookie("token");
      res.status(200).json({ success: true, message: "Logged out successfully." });
    } catch (error) {
      HandleError.handle(error, res);
    }
  }

  // async updatePassword(req: Request, res: Response) {
  //   try {
  //     const validateData = UpdatePasswordZodSchema.parse(req.body);
  //     const { role, verificationToken, password } = validateData;
  //     if (!role || !verificationToken || !password) throw new Error("Invalid request.");
  //     const result = await this.updatePasswordUseCase.execute({role, verificationToken, password});
  //     res.status(200).json(result);
  //   } catch (error) {
  //     HandleError.handle(error, res);
  //   }
  // }

  // async checkUserStatus(req: Request, res: Response) {
  //   try {
  //     const user = req.user;
  //     if(!user) throw new Error("")
  //     const result = await this.checkUserStatusUseCase.execute({id: new Types.ObjectId(user.userOrProviderId), role: user.role});
  //     res.status(result.status).json(result);
  //   } catch (error) {
  //     HandleError.handle(error, res);
  //   }
  // }

}

const authController = new AuthController(registerUseCase, verifyOTPUseCase, resendOtpUseCase, loginUseCase);
export { authController };
