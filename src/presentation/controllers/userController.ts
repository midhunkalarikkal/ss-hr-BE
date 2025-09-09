import { Request, Response } from "express";
import { Types } from 'mongoose';
import { aws_s3Config } from "../../config/env";
import { HandleError } from "../../infrastructure/error/error";
import { SignedUrlService } from "../../infrastructure/service/generateSignedUrl";
import { UserRepositoryImpl } from "../../infrastructure/database/user/userRepositoryImpl";
import { SignedUrlRepositoryImpl } from "../../infrastructure/database/signedUrl/signedUrlRepositoryImpl";
import { GetAllUsersForChatSideBarUseCase } from "../../application/adminUse-cases/adminGetAllUsersForChatSidebarUseCase";
import { CreateUserByAdminUseCase,UpdateUserUseCase,DeleteUserUseCase,GetUserByIdUseCase,GetAllUsersUseCase,GetUserStatsUseCase} from '../../application/use-cases/userUseCases';

const userRepositoryImpl = new UserRepositoryImpl();
const signedUrlRepositoryImpl = new SignedUrlRepositoryImpl();
const signedUrlService = new SignedUrlService(aws_s3Config.bucketName, signedUrlRepositoryImpl);
const getAllUsersForChatSideBarUseCase = new GetAllUsersForChatSideBarUseCase(userRepositoryImpl, signedUrlService);
const createUserByAdminUseCase = new CreateUserByAdminUseCase(userRepositoryImpl);
const updateUserUseCase = new UpdateUserUseCase(userRepositoryImpl);
const deleteUserUseCase = new DeleteUserUseCase(userRepositoryImpl);
const getUserByIdUseCase = new GetUserByIdUseCase(userRepositoryImpl);
const getAllUsersUseCase = new GetAllUsersUseCase(userRepositoryImpl);
const getUserStatsUseCase = new GetUserStatsUseCase(userRepositoryImpl);

export class UserController {
    constructor(
        private getAllUsersForChatSideBarUseCase: GetAllUsersForChatSideBarUseCase,
        private createUserByAdminUseCase: CreateUserByAdminUseCase,
        private updateUserUseCase: UpdateUserUseCase,
        private deleteUserUseCase: DeleteUserUseCase,
        private getUserByIdUseCase: GetUserByIdUseCase,
        private getAllUsersUseCase: GetAllUsersUseCase,
        private getUserStatsUseCase: GetUserStatsUseCase
    ) {
        this.getAdminsForChatSidebar = this.getAdminsForChatSidebar.bind(this);
        this.createUser = this.createUser.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.getUserById = this.getUserById.bind(this);
        this.getAllUsers = this.getAllUsers.bind(this);
        this.getUserStats = this.getUserStats.bind(this);
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

    async createUser(req: Request, res: Response) {
        try {
            const result = await this.createUserByAdminUseCase.execute(req.body);
            return res.status(201).json(result);
        } catch (error) {
            console.log("createUser error : ", error);
            HandleError.handle(error, res);
        }
    }

    async updateUser(req: Request, res: Response) {
        try {
            const userId = new Types.ObjectId(req.params.id);
            const result = await this.updateUserUseCase.execute({ _id: userId, ...req.body });
            return res.status(200).json(result);
        } catch (error) {
            console.log("updateUser error : ", error);
            HandleError.handle(error, res);
        }
    }

    async deleteUser(req: Request, res: Response) {
        try {
            const userId = new Types.ObjectId(req.params.id);
            const result = await this.deleteUserUseCase.execute({ userId });
            return res.status(200).json(result);
        } catch (error) {
            console.log("deleteUser error : ", error);
            HandleError.handle(error, res);
        }
    }

    async getUserById(req: Request, res: Response) {
        try {
            const userId = new Types.ObjectId(req.params.id);
            const result = await this.getUserByIdUseCase.execute({ userId });
            return res.status(200).json(result);
        } catch (error) {
            console.log("getUserById error : ", error);
            HandleError.handle(error, res);
        }
    }

    async getAllUsers(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await this.getAllUsersUseCase.execute({ page, limit });
            return res.status(200).json(result);
        } catch (error) {
            console.log("getAllUsers error : ", error);
            HandleError.handle(error, res);
        }
    }

    async getUserStats(req: Request, res: Response) {
        try {
            const result = await this.getUserStatsUseCase.execute();
            return res.status(200).json(result);
        } catch (error) {
            console.log("getUserStats error : ", error);
            HandleError.handle(error, res);
        }
    }
}

const userController = new UserController(
    getAllUsersForChatSideBarUseCase,
    createUserByAdminUseCase,
    updateUserUseCase,
    deleteUserUseCase,
    getUserByIdUseCase,
    getAllUsersUseCase,
    getUserStatsUseCase
);

export { userController };