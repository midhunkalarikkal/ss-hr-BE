import { JWTService } from '../../infrastructure/security/jwt';
import { generateSignedUrl } from '../../config/aws_s3';
import { UserRepositoryImpl } from '../../infrastructure/database/user/userRepositoryImpl';
import { LoginResponse } from '../../infrastructure/dtos/auth.dto';
import { User } from '../../domain/entities/user';

export class GoogleAuthUseCase {

  constructor(private userRepository: UserRepositoryImpl) {}

  async execute(user: User): Promise<LoginResponse> {
    try {

      const token = JWTService.generateToken({ id: user._id, role: user.role });
      let updateProfileImage;

      if (user.profileImage) {
        if (user.profileImage.startsWith('http')) {
          updateProfileImage = user.profileImage;
        } else {
          const urlParts = user.profileImage?.split('/');
          const s3Key = urlParts.slice(3).join('/');
          const signedUrl = await generateSignedUrl(s3Key);
          updateProfileImage = signedUrl || user.profileImage;
        }
      }

      return {
        success: true,
        message: 'Google login successful.',
        user: {
          _id: user._id,
          fullName: user.fullName,
          profileImage: updateProfileImage || user.profileImage,
          role: user.role,
          token,
        }
      };
      
    } catch (error) {
      throw new Error(`Google auth error: ${error}`);
    }
  }
}