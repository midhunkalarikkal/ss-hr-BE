import { Request, Response } from "express";
import { Types } from 'mongoose';
import { HandleError } from "../../infrastructure/error/error";
import { PackageRepositoryImpl } from "../../infrastructure/database/package/packageRepositoryImpl";
import {
  CreatePackageUseCase,
  UpdatePackageUseCase,
  DeletePackageUseCase,
  GetPackageByIdUseCase,
  GetAllPackagesUseCase,
  GetPackagesByTypeUseCase,
  GetPackageStatsUseCase
} from '../../application/use-cases/packageUseCases';

const packageRepositoryImpl = new PackageRepositoryImpl();
const createPackageUseCase = new CreatePackageUseCase(packageRepositoryImpl);
const updatePackageUseCase = new UpdatePackageUseCase(packageRepositoryImpl);
const deletePackageUseCase = new DeletePackageUseCase(packageRepositoryImpl);
const getPackageByIdUseCase = new GetPackageByIdUseCase(packageRepositoryImpl);
const getAllPackagesUseCase = new GetAllPackagesUseCase(packageRepositoryImpl);
const getPackagesByTypeUseCase = new GetPackagesByTypeUseCase(packageRepositoryImpl);
const getPackageStatsUseCase = new GetPackageStatsUseCase(packageRepositoryImpl);

export class PackageController {
    constructor(
        private createPackageUseCase: CreatePackageUseCase,
        private updatePackageUseCase: UpdatePackageUseCase,
        private deletePackageUseCase: DeletePackageUseCase,
        private getPackageByIdUseCase: GetPackageByIdUseCase,
        private getAllPackagesUseCase: GetAllPackagesUseCase,
        private getPackagesByTypeUseCase: GetPackagesByTypeUseCase,
        private getPackageStatsUseCase: GetPackageStatsUseCase
    ) {
        this.createPackage = this.createPackage.bind(this);
        this.updatePackage = this.updatePackage.bind(this);
        this.deletePackage = this.deletePackage.bind(this);
        this.getPackageById = this.getPackageById.bind(this);
        this.getAllPackages = this.getAllPackages.bind(this);
        this.getPackagesByType = this.getPackagesByType.bind(this);
        this.getPackageStats = this.getPackageStats.bind(this);
    }

    async createPackage(req: Request, res: Response) {
        try {
            const result = await this.createPackageUseCase.execute(req.body);
            return res.status(201).json(result);
        } catch (error) {
            console.log("createPackage error : ", error);
            HandleError.handle(error, res);
        }
    }

    async updatePackage(req: Request, res: Response) {
        try {
            const packageId = new Types.ObjectId(req.params.id);
            const result = await this.updatePackageUseCase.execute({ _id: packageId, ...req.body });
            return res.status(200).json(result);
        } catch (error) {
            console.log("updatePackage error : ", error);
            HandleError.handle(error, res);
        }
    }

    async deletePackage(req: Request, res: Response) {
        try {
            const packageId = new Types.ObjectId(req.params.id);
            const result = await this.deletePackageUseCase.execute({ packageId });
            return res.status(200).json(result);
        } catch (error) {
            console.log("deletePackage error : ", error);
            HandleError.handle(error, res);
        }
    }

    async getPackageById(req: Request, res: Response) {
        try {
            const packageId = new Types.ObjectId(req.params.id);
            const result = await this.getPackageByIdUseCase.execute({ packageId });
            return res.status(200).json(result);
        } catch (error) {
            console.log("getPackageById error : ", error);
            HandleError.handle(error, res);
        }
    }

    async getAllPackages(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await this.getAllPackagesUseCase.execute({ page, limit });
            return res.status(200).json(result);
        } catch (error) {
            console.log("getAllPackages error : ", error);
            HandleError.handle(error, res);
        }
    }

    async getPackagesByType(req: Request, res: Response) {
        try {
            const packageType = req.params.type;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await this.getPackagesByTypeUseCase.execute({ packageType, page, limit });
            return res.status(200).json(result);
        } catch (error) {
            console.log("getPackagesByType error : ", error);
            HandleError.handle(error, res);
        }
    }

    async getPackageStats(req: Request, res: Response) {
        try {
            const result = await this.getPackageStatsUseCase.execute();
            return res.status(200).json(result);
        } catch (error) {
            console.log("getPackageStats error : ", error);
            HandleError.handle(error, res);
        }
    }
}

const packageController = new PackageController(
    createPackageUseCase,
    updatePackageUseCase,
    deletePackageUseCase,
    getPackageByIdUseCase,
    getAllPackagesUseCase,
    getPackagesByTypeUseCase,
    getPackageStatsUseCase
);

export { packageController };