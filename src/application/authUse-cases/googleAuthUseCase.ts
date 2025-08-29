import { User } from '../../domain/entities/user';
import { JWTService } from '../../infrastructure/security/jwt';
import { LoginResponse } from '../../infrastructure/dtos/auth.dto';
import { UserRepositoryImpl } from '../../infrastructure/database/user/userRepositoryImpl';

export class GoogleAuthUseCase {

  constructor(
    private userRepository: UserRepositoryImpl,
  ) {}

  async execute(user: User): Promise<LoginResponse> {
    try {

      const token = JWTService.generateToken({ id: user._id, role: user.role });

      //TODO google user creation

      return {
        success: true,
        message: 'Google login successful.',
        user: {
          _id: user._id,
          fullName: user.fullName,
          profileImage: user.profileImage,
          role: user.role,
          token,
        }
      };
      
    } catch (error) {
      throw new Error(`Google auth error: ${error}`);
    }
  }
}