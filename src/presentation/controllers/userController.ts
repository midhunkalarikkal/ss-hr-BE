// **** Controller for user side ( not for admins user side);

import { Request, Response } from "express";
import { aws_s3Config } from "../../config/env";
import { HandleError } from "../../infrastructure/error/error";
import { SignedUrlService } from "../../infrastructure/service/generateSignedUrl";
import { UserRepositoryImpl } from "../../infrastructure/database/user/userRepositoryImpl";
import { SignedUrlRepositoryImpl } from "../../infrastructure/database/signedUrl/signedUrlRepositoryImpl";
import { GetAllUsersForChatSideBarUseCase } from "../../application/commonUse-cases/getAllUsersForChatSidebarUseCase";
import { UseGetTestimonialsUseCase } from "../../application/userUseCase.ts/userTestimonial";
import { TestimonialRepositoryImpl } from "../../infrastructure/database/testimonial/testimonialRepositoryImpl";
import { DecodedUser } from "../../express";
import { UserUpdateUserProfileImageUseCase } from "../../application/userUseCase.ts/userProfileUseCase";
import { FileDeleteService, FileUploadService } from "../../infrastructure/service/fileUpload";
import { S3Client } from "@aws-sdk/client-s3";
import { S3KeyGenerator } from "../../infrastructure/helper/generateS3key";
import { RandomStringGenerator } from "../../infrastructure/helper/generateRandomString";
import { Types } from "mongoose";

const s3 = new S3Client();
const fileDeleteService = new FileDeleteService(s3);
const userRepositoryImpl = new UserRepositoryImpl();
const randomStringGenerator = new RandomStringGenerator();
const signedUrlRepositoryImpl = new SignedUrlRepositoryImpl();
const s3KeyGenerator = new S3KeyGenerator(randomStringGenerator);
const testimonialRepositoryImpl = new TestimonialRepositoryImpl();
const fileUploadService = new  FileUploadService(s3, s3KeyGenerator);
const signedUrlService = new SignedUrlService(aws_s3Config.bucketName, signedUrlRepositoryImpl);

const getAllUsersForChatSideBarUseCase = new GetAllUsersForChatSideBarUseCase(userRepositoryImpl, signedUrlService);
const useGetTestimonialsUseCase = new UseGetTestimonialsUseCase(testimonialRepositoryImpl, signedUrlService);
const userUpdateUserProfileImageUseCase = new UserUpdateUserProfileImageUseCase(userRepositoryImpl, fileDeleteService, fileUploadService, signedUrlService );

export class UserController {
    constructor(
        private getAllUsersForChatSideBarUseCase: GetAllUsersForChatSideBarUseCase,
        private userUpdateUserProfileImageUseCase: UserUpdateUserProfileImageUseCase,
        private useGetTestimonialsUseCase: UseGetTestimonialsUseCase,
    ) {
        this.getAdminsForChatSidebar = this.getAdminsForChatSidebar.bind(this);
        this.updateUserProfileImage = this.updateUserProfileImage.bind(this);
        this.getTestimonilas = this.getTestimonilas.bind(this);
    }

    async getAdminsForChatSidebar(req: Request, res: Response) {
        try {
            const result = await this.getAllUsersForChatSideBarUseCase.execute(false);
            res.status(200).json(result);
        } catch (error) {
            console.log("getAllUsersForChatSidebar error : ", error);
            HandleError.handle(error, res);
        }
    }

    async updateUserProfileImage(req: Request, res: Response) {
         try {
            console.log("ProfileImage updating ")
            const userId = (req.user as DecodedUser).userId;
            const file = req.file;
            if(!userId || !file) throw new Error("Invalid request.");
            const result = await this.userUpdateUserProfileImageUseCase.execute({userId: new Types.ObjectId(userId), file});
            console.log("result : ",result);
            res.status(200).json(result);
        } catch (error) {
            console.log("getTestimonilas error : ", error);
            HandleError.handle(error, res);
        }
    }

    async getTestimonilas(req: Request, res: Response) {
        try {
            const result = await this.useGetTestimonialsUseCase.execute();
            res.status(200).json(result);
        } catch (error) {
            console.log("getTestimonilas error : ", error);
            HandleError.handle(error, res);
        }
    }
    

}

const userController = new UserController(
    getAllUsersForChatSideBarUseCase,
    userUpdateUserProfileImageUseCase,
    useGetTestimonialsUseCase
);

export { userController };