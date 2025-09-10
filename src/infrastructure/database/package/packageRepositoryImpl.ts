import { Types } from "mongoose";
import { IPackage, PackageModel } from "./packageModel";
import { Package } from "../../../domain/entities/package";
import { ApiPaginationRequest, ApiResponse } from "../../dtos/common.dts";
import { AdminFetchAllPackages, CreatePackage, IPackageRepository } from "../../../domain/repositories/IPackageRepository";

export class PackageRepositoryImpl implements IPackageRepository {
  private mapToEntity(packageData: IPackage): Package {
    return new Package(
      packageData._id,
      packageData.packageName,
      packageData.description,
      packageData.priceIN,
      packageData.priceUAE,
      packageData.packageType,
      packageData.packageDuration,
      packageData.image,
      packageData.features,
      packageData.food,
      packageData.accommodation,
      packageData.travelCard,
      packageData.utilityBills,
      packageData.airportPickup,
      packageData.jobGuidance,
      packageData.createdAt.toISOString(),
      packageData.updatedAt.toISOString()
    );
  }

  async createPackage(packageData: CreatePackage): Promise<Package> {
    try {
      const createdPackage = await PackageModel.create(packageData);
      return this.mapToEntity(createdPackage);
    } catch (error: any) {
      console.error("Detailed createPackage error:", error);
      throw new Error("Unable to create package, please try again after a few minutes.");
    }
  }

  async findAllPackages({ page, limit }: ApiPaginationRequest): Promise<ApiResponse<AdminFetchAllPackages>> {
    try {
      const skip = (page - 1) * limit;
      const [packages, totalCount] = await Promise.all([
        PackageModel.find(
          {},
          {
            _id: 1,
            packageName: 1,
            description: 1,
            priceIN: 1,
            priceUAE: 1,
            packageType: 1,
            packageDuration: 1,
            image: 1,
            features: 1,
            food: 1,
            accommodation: 1,
            travelCard: 1,
            utilityBills: 1,
            airportPickup: 1,
            jobGuidance: 1,
            createdAt: 1,
            updatedAt: 1,
          }
        )
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .lean(),
        PackageModel.countDocuments(),
      ]);

      const totalPages = Math.ceil(totalCount / limit);
      return {
        data: packages.map(this.mapToEntity),
        totalPages,
        currentPage: page,
        totalCount,
      };
    } catch (error) {
      throw new Error("Failed to fetch packages from database.");
    }
  }

  async findPackageById(packageId: Types.ObjectId): Promise<Package | null> {
    try {
      const packageData = await PackageModel.findById(packageId);
      return packageData ? this.mapToEntity(packageData) : null;
    } catch (error) {
      throw new Error("Package not found.");
    }
  }

  async updatePackage(packageData: Package): Promise<Package | null> {
    try {
      const updatedPackage = await PackageModel.findByIdAndUpdate(packageData._id, packageData, {
        new: true,
      });
      return updatedPackage ? this.mapToEntity(updatedPackage) : null;
    } catch (error) {
      throw new Error("Unable to update package.");
    }
  }

  async deletePackage(packageId: Types.ObjectId): Promise<boolean> {
    try {
      const result = await PackageModel.findByIdAndDelete(packageId);
      return !!result;
    } catch (error) {
      throw new Error("Failed to delete package");
    }
  }

  async getTotalCount(): Promise<number> {
    try {
      return await PackageModel.countDocuments();
    } catch (error) {
      throw new Error("Failed to get total count");
    }
  }

  async findPackagesByType(packageType: string, { page, limit }: ApiPaginationRequest): Promise<ApiResponse<AdminFetchAllPackages>> {
    try {
      const skip = (page - 1) * limit;
      const [packages, totalCount] = await Promise.all([
        PackageModel.find(
          { packageType },
          {
            _id: 1,
            packageName: 1,
            description: 1,
            priceIN: 1,
            priceUAE: 1,
            packageType: 1,
            packageDuration: 1,
            image: 1,
            features: 1,
            food: 1,
            accommodation: 1,
            travelCard: 1,
            utilityBills: 1,
            airportPickup: 1,
            jobGuidance: 1,
            createdAt: 1,
            updatedAt: 1,
          }
        )
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .lean(),
        PackageModel.countDocuments({ packageType }),
      ]);

      const totalPages = Math.ceil(totalCount / limit);
      return {
        data: packages.map(this.mapToEntity),
        totalPages,
        currentPage: page,
        totalCount,
      };
    } catch (error) {
      throw new Error("Failed to fetch packages by type from database.");
    }
  }
}