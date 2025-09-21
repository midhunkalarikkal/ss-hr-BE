import { ApiResponse } from "../../infrastructure/dtos/common.dts";
import { CreateAdmin } from "../../domain/repositories/IUserRepository";
import { FileDeleteService, FileUploadService } from "../../infrastructure/service/fileUpload";
import { handleUseCaseError } from "../../infrastructure/error/useCaseError";
import { PasswordHasher } from "../../infrastructure/security/passwordHasher";
import { validateFile } from "../../infrastructure/validator/imageFileValidator";
import { SignedUrlService } from "../../infrastructure/service/generateSignedUrl";
import { UserRepositoryImpl } from "../../infrastructure/database/user/userRepositoryImpl";
import { CreateAdminRequest, CreateAdminResponse } from "../../infrastructure/dtos/admin.dtos";
import { Types } from "mongoose";

export class CreateAdminUseCase {
    constructor(
        private userRepositoryImpl: UserRepositoryImpl,
        private fileUploadService: FileUploadService,
        private signedUrlService: SignedUrlService
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

            const serialNumber: string = await this.userRepositoryImpl.generateNextSerialNumber();

            password = await PasswordHasher.hashPassword(password);
            const adminData = { fullName, email, password, phone, role }

            const createdAdmin = await this.userRepositoryImpl.createUser<CreateAdmin>({
                ...adminData,
                serialNumber,
                profileImage: profileImageUrl,
                isVerified: true,
            });

            const signedUrl = await this.signedUrlService.generateSignedUrl(
                createdAdmin.profileImage
            );

            const { phoneTwo, isVerified, verificationToken, googleId, updatedAt, password: adminPassword, ...newAdmin } = createdAdmin;

            return { success: true, message: "New admin created", data: { ...newAdmin, profileImage: signedUrl } }
        } catch (error) {
            throw handleUseCaseError(error || "Unexpected error in verifying otp");
        }
    }
}


export class DeleteAdminUseCase {
    constructor(
        private userRepositoryImpl: UserRepositoryImpl,
        private fileDeleteService: FileDeleteService
    ) { }

    async execute(adminId: Types.ObjectId): Promise<ApiResponse> {
        try {

            if (!adminId) throw new Error("Invalid request");

            const admin = await this.userRepositoryImpl.findUserById(adminId);
            if (!admin) throw new Error("No admin found");
            if (admin.role !== "admin") throw new Error("Invalid request");

            if (admin.profileImage) {
                const response = await this.fileDeleteService.deleteFile(admin.profileImage);
                if (!response) throw new Error("Old textimonial profile image failed");
            }

            const response = await this.userRepositoryImpl.deleteUserById(adminId);
            if (!response) throw new Error("Admin deleting failed");

            return { success: true, message: 'Admin deleted successfully' };
        } catch (error) {
            throw handleUseCaseError(error || "Unexpected error in deleting admin");
        }
    }
}