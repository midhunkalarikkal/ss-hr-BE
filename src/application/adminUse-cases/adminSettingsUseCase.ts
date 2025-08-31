import { ApiResponse } from "../../infrastructure/dtos/common.dts";
import { FileUploadService } from "../../infrastructure/service/fileUpload";
import { handleUseCaseError } from "../../infrastructure/error/useCaseError";
import { PasswordHasher } from "../../infrastructure/security/passwordHasher";
import { validateFile } from "../../infrastructure/validator/imageFileValidator";
import { UserRepositoryImpl } from "../../infrastructure/database/user/userRepositoryImpl";
import { CreateAdminRequest, CreateAdminResponse } from "../../infrastructure/dtos/admin.dtos";

export class CreateAdminUseCase {
    constructor(
        private userRepositoryImpl: UserRepositoryImpl,
        private fileUploadService: FileUploadService,
    ) { }

    async execute(payload: CreateAdminRequest): Promise<ApiResponse<CreateAdminResponse>> {
        try {
            let { fullName, email, password, phone, profileImage, role } = payload;

            const isValidFile = validateFile(profileImage);
            if (!isValidFile) throw new Error("Invalid profile image file");

            let profileImageUrl: string = "";
            if (profileImage) {
                profileImageUrl = await this.fileUploadService.uploadFile({
                    folder: "ss-hr-users-profileImage",
                    userId: role,
                    file: profileImage,
                });
            }

            password = await PasswordHasher.hashPassword(password);
            const adminData = { fullName, email, password, phone, role }

            const createdAdmin = await this.userRepositoryImpl.createUser({
                ...adminData,
                profileImage: profileImageUrl,
                isVerified: true,
            });

            const { phoneTwo, isVerified, verificationToken, googleId, updatedAt, password: adminPassword, ...newAdmin } = createdAdmin;

            return { success: true, message: "New admin created", data: newAdmin }
        } catch (error) {
            throw handleUseCaseError(error || "Unexpected error in VerifyOTPUseCase");
        }
    }
}