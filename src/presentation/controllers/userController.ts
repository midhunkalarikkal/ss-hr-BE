import { Request, Response } from "express";
import { aws_s3Config } from "../../config/env";
import { HandleError } from "../../infrastructure/error/error";
import { SignedUrlService } from "../../infrastructure/service/generateSignedUrl";
import { UserRepositoryImpl } from "../../infrastructure/database/user/userRepositoryImpl";
import { SignedUrlRepositoryImpl } from "../../infrastructure/database/signedUrl/signedUrlRepositoryImpl";
import { GetAllUsersForChatSideBarUseCase } from "../../application/adminUse-cases/adminGetAllUsersForChatSidebarUseCase";


const userRepositoryImpl = new UserRepositoryImpl();
const signedUrlRepositoryImpl = new SignedUrlRepositoryImpl();

const signedUrlService = new SignedUrlService(aws_s3Config.bucketName,signedUrlRepositoryImpl);
const getAllUsersForChatSideBarUseCase = new GetAllUsersForChatSideBarUseCase(userRepositoryImpl, signedUrlService);

export class UserController {
    constructor(
        private getAllUsersForChatSideBarUseCase: GetAllUsersForChatSideBarUseCase
    ) {
        this.getAdminsForChatSidebar = this.getAdminsForChatSidebar.bind(this);
    }

    async getAdminsForChatSidebar(req: Request, res: Response) {
        try {
            const result = await this.getAllUsersForChatSideBarUseCase.execute(false);
            return res.status(200).json(result);
        } catch (error) {
            console.log("getAllUsersForChatSidebar error : ", error);
            HandleError.handle(error, res);
        }
    }
}

const userController = new UserController(getAllUsersForChatSideBarUseCase);
export { userController };