import { Request, Response} from 'express';
import { appConfig } from '../../config/env';
import { HandleError } from '../../infrastructure/error/error';
import { RegisterZodSchema } from '../../infrastructure/zod/auth.zod';
import { RegisterUseCase } from '../../application/use-cases/authUseCases';
import { UserRepositoryImpl } from '../../infrastructure/database/user/userRepositoryImpl';

const userRepositoryImpl = new UserRepositoryImpl();
const registerUseCase = new RegisterUseCase(userRepositoryImpl);

export class AuthController {

  constructor(
    private registerUseCase: RegisterUseCase
  ) {
    this.register = this.register.bind(this);
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
}

const authController = new AuthController(registerUseCase);
export { authController };
