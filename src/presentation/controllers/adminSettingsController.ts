import { Request, Response } from "express";
import { S3Client } from "@aws-sdk/client-s3";
import { aws_s3Config } from "../../config/env";
import { HandleError } from "../../infrastructure/error/error";
import { CreateAdminZodSchema } from "../../infrastructure/zod/admin.zod";
import { FileUploadService } from "../../infrastructure/service/fileUpload";
import { S3KeyGenerator } from "../../infrastructure/helper/generateS3key";
import { SignedUrlService } from "../../infrastructure/service/generateSignedUrl";
import { CreateAdminUseCase } from "../../application/adminUse-cases/adminSettingsUseCase";
import { UserRepositoryImpl } from "../../infrastructure/database/user/userRepositoryImpl";
import { SignedUrlRepositoryImpl } from "../../infrastructure/database/signedUrl/signedUrlRepositoryImpl";

const s3Clien = new S3Client();
const s3KeyGenerator = new S3KeyGenerator();
const signedUrlRepositoryImpl = new SignedUrlRepositoryImpl();
const signedUrlService = new SignedUrlService(aws_s3Config.bucketName, signedUrlRepositoryImpl);

const userRepositoryImpl = new UserRepositoryImpl();
const fileUploadService = new FileUploadService(s3Clien, signedUrlService, s3KeyGenerator);
const createAdminUseCase = new CreateAdminUseCase(userRepositoryImpl, fileUploadService);

export class AdminSettingsController {
    constructor(
        private createAdminUseCase: CreateAdminUseCase,
    ) {
        this.createNewAdmin = this.createNewAdmin.bind(this);
    }

    async createNewAdmin(req: Request, res: Response) {
        try {
            const validated = CreateAdminZodSchema.parse(req.body);
            const result = await this.createAdminUseCase.execute({ ...validated, profileImage: req.file });
            res.status(201).json(result);
        } catch (error) {
            console.log("create admin controller error : ", error);
            HandleError.handle(error, res);
        }
    }
}

const adminSettingsController = new AdminSettingsController(createAdminUseCase);
export { adminSettingsController };