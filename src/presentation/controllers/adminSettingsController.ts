import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";
import { CreateAdminZodSchema } from "../../infrastructure/zod/admin.zod";
import { CreateAdminUseCase } from "../../application/adminUse-cases/adminSettingsUseCase";
import { UserRepositoryImpl } from "../../infrastructure/database/user/userRepositoryImpl";

const userRepositoryImpl = new UserRepositoryImpl();
const createAdminUseCase = new CreateAdminUseCase(userRepositoryImpl);

export class AdminSettingsController {
    constructor(
        private createAdminUseCase: CreateAdminUseCase,
    ) {
        this.createNewAdmin = this.createNewAdmin.bind(this);
    }

    async createNewAdmin(req: Request, res: Response) {
        try {
            const validated = CreateAdminZodSchema.parse(req.body);
            const result = await this.createAdminUseCase.execute({...validated, profileImage: req.file});
            res.status(201).json(result);
        } catch (error) {
            console.log("create admin controller error : ", error);
            HandleError.handle(error, res);
        }
    }
}

const adminSettingsController = new AdminSettingsController(createAdminUseCase);
export { adminSettingsController };