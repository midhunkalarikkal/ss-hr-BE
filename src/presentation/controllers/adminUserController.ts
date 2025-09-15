import { Request, Response } from "express";
import { S3Client } from "@aws-sdk/client-s3";
import { aws_s3Config } from "../../config/env";
import { HandleError } from "../../infrastructure/error/error";
import { CreateAdminZodSchema } from "../../infrastructure/zod/admin.zod";
import { S3KeyGenerator } from "../../infrastructure/helper/generateS3key";
import { FileUploadService } from "../../infrastructure/service/fileUpload";
import { SignedUrlService } from "../../infrastructure/service/generateSignedUrl";
import { RandomStringGenerator } from "../../infrastructure/helper/generateRandomString";
import { CreateAdminUseCase } from "../../application/adminUse-cases/adminSettingsUseCase";
import { UserRepositoryImpl } from "../../infrastructure/database/user/userRepositoryImpl";
import { SignedUrlRepositoryImpl } from "../../infrastructure/database/signedUrl/signedUrlRepositoryImpl";
import { GetAllUsersForChatSideBarUseCase } from "../../application/adminUse-cases/adminGetAllUsersForChatSidebarUseCase";
import { AdminGetAllAdminsUseCase } from "../../application/use-cases/adminGetAllAdminsUseCase";
import { paginationReqQuery } from "../../infrastructure/zod/common.zod";

const s3Clien = new S3Client();
const randomStringGenerator = new RandomStringGenerator()
const s3KeyGenerator = new S3KeyGenerator(randomStringGenerator);

const userRepositoryImpl = new UserRepositoryImpl();
const fileUploadService = new FileUploadService(s3Clien, s3KeyGenerator);
const createAdminUseCase = new CreateAdminUseCase(userRepositoryImpl, fileUploadService);
const signedUrlRepositoryImpl = new SignedUrlRepositoryImpl();

const signedUrlService = new SignedUrlService(aws_s3Config.bucketName,signedUrlRepositoryImpl);
const getAllUsersForChatSideBarUseCase = new GetAllUsersForChatSideBarUseCase(userRepositoryImpl, signedUrlService);
const adminGetAllAdminsUseCase = new AdminGetAllAdminsUseCase(userRepositoryImpl);

export class AdminUserController {
    constructor(
        private createAdminUseCase: CreateAdminUseCase,
        private getAllUsersForChatSideBarUseCase: GetAllUsersForChatSideBarUseCase,
        private adminGetAllAdminsUseCase: AdminGetAllAdminsUseCase,
    ) {
        this.createNewAdmin = this.createNewAdmin.bind(this);
        this.getAllUsersForChatSidebar = this.getAllUsersForChatSidebar.bind(this);
        this.getAllAdmins = this.getAllAdmins.bind(this);
    }

    async createNewAdmin(req: Request, res: Response) {
        try {
            const validated = CreateAdminZodSchema.parse(req.body);
            const result = await this.createAdminUseCase.execute({ ...validated, profileImage: req.file });
            res.status(201).json(result);
        } catch (error) {
            console.log("createNewAdmin error : ", error);
            HandleError.handle(error, res);
        }
    }

    async getAllUsersForChatSidebar(req: Request, res: Response) {
        try {
            const result = await this.getAllUsersForChatSideBarUseCase.execute(true);
            return res.status(200).json(result);
        } catch (error) {
            console.log("getAllUsersForChatSidebar error : ", error);
            HandleError.handle(error, res);
        }
    }
    
    async getAllAdmins(req: Request, res: Response) {
        try {
            const validatedData = paginationReqQuery.parse(req.query);
            const result = await this.adminGetAllAdminsUseCase.execute(validatedData);
            return res.status(200).json(result);
        } catch (error) {
            console.log("getAllAdmins error : ", error);
            HandleError.handle(error, res);
        }
    }
}

const adminUserController = new AdminUserController(createAdminUseCase, getAllUsersForChatSideBarUseCase, adminGetAllAdminsUseCase);
export { adminUserController };