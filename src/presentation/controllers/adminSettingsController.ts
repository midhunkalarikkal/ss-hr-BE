import { Types } from "mongoose";
import { Request, Response } from "express";
import { S3Client } from "@aws-sdk/client-s3";
import { aws_s3Config } from "../../config/env";
import { HandleError } from "../../infrastructure/error/error";
import { paginationReqQuery } from "../../infrastructure/zod/common.zod";
import { CreateAdminZodSchema } from "../../infrastructure/zod/admin.zod";
import { S3KeyGenerator } from "../../infrastructure/helper/generateS3key";
import { SignedUrlService } from "../../infrastructure/service/generateSignedUrl";
import { RandomStringGenerator } from "../../infrastructure/helper/generateRandomString";
import { UserRepositoryImpl } from "../../infrastructure/database/user/userRepositoryImpl";
import { FileDeleteService, FileUploadService } from "../../infrastructure/service/fileUpload";
import { AdminGetAllAdminsUseCase } from "../../application/adminUse-cases/adminGetAllAdminsUseCase";
import { SignedUrlRepositoryImpl } from "../../infrastructure/database/signedUrl/signedUrlRepositoryImpl";
import { CreateAdminUseCase, DeleteAdminUseCase } from "../../application/adminUse-cases/adminSettingsUseCase";

const s3Client = new S3Client();
const randomStringGenerator = new RandomStringGenerator()
const s3KeyGenerator = new S3KeyGenerator(randomStringGenerator);
const signedUrlRepositoryImpl = new SignedUrlRepositoryImpl();
const signedUrlService = new SignedUrlService(aws_s3Config.bucketName, signedUrlRepositoryImpl);
const fileDeleteService = new FileDeleteService(s3Client);

const userRepositoryImpl = new UserRepositoryImpl();
const fileUploadService = new FileUploadService(s3Client, s3KeyGenerator);
const adminGetAllAdminsUseCase = new AdminGetAllAdminsUseCase(userRepositoryImpl);
const createAdminUseCase = new CreateAdminUseCase(userRepositoryImpl, fileUploadService, signedUrlService);
const deleteAdminUseCase = new DeleteAdminUseCase(userRepositoryImpl, fileDeleteService);

export class AdminSettingsController {
    constructor(
        private createAdminUseCase: CreateAdminUseCase,
        private adminGetAllAdminsUseCase: AdminGetAllAdminsUseCase,
        private deleteAdminUseCase: DeleteAdminUseCase,
    ) {
        this.createNewAdmin = this.createNewAdmin.bind(this);
        this.getAllAdmins = this.getAllAdmins.bind(this);
        this.deleteAdmin = this.deleteAdmin.bind(this);
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

    async deleteAdmin(req: Request, res: Response) {
        try {
            console.log("Admin deleting")
            const { id: adminId } = req.params;
            const result = await this.deleteAdminUseCase.execute(new Types.ObjectId(adminId));
            res.status(200).json(result);
        } catch (error) {
            console.log("deleteAdmin error : ", error);
            HandleError.handle(error, res);
        }
    }

}

const adminSettingsController = new AdminSettingsController(
    createAdminUseCase, 
    adminGetAllAdminsUseCase, 
    deleteAdminUseCase
);
export { adminSettingsController };