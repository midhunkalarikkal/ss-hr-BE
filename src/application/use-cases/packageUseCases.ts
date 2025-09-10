import { Types } from "mongoose";
import { Package } from "../../domain/entities/package";
import { ApiResponse } from "../../infrastructure/dtos/common.dts";
import { handleUseCaseError } from "../../infrastructure/error/useCaseError";
import { PackageRepositoryImpl } from "../../infrastructure/database/package/packageRepositoryImpl";
import {
  CreatePackageRequest,
  CreatePackageResponse,
  UpdatePackageRequest,
  UpdatePackageResponse,
  DeletePackageRequest,
  GetPackageByIdRequest,
  GetPackageByIdResponse,
  GetPackagesByTypeRequest,
} from "../../infrastructure/dtos/package.dto";

export class CreatePackageUseCase {
  constructor(private packageRepository: PackageRepositoryImpl) {}

  async execute(data: CreatePackageRequest): Promise<CreatePackageResponse> {
    try {
      const { 
        packageName, 
        description, 
        priceIN, 
        priceUAE, 
        packageType, 
        packageDuration, 
        image, 
        features,
        food,
        accommodation,
        travelCard,
        utilityBills,
        airportPickup,
        jobGuidance
      } = data;

      const createdPackage = await this.packageRepository.createPackage({
        packageName,
        description,
        priceIN,
        priceUAE,
        packageType,
        packageDuration,
        image,
        features,
        food: food || false,
        accommodation: accommodation || false,
        travelCard: travelCard || false,
        utilityBills: utilityBills || false,
        airportPickup: airportPickup || false,
        jobGuidance: jobGuidance || false,
      });

      return {
        success: true,
        message: "Package created successfully",
        package: {
          _id: createdPackage._id,
          packageName: createdPackage.packageName,
          description: createdPackage.description,
          priceIN: createdPackage.priceIN,
          priceUAE: createdPackage.priceUAE,
          packageType: createdPackage.packageType,
          packageDuration: createdPackage.packageDuration,
          image: createdPackage.image,
          features: createdPackage.features,
          food: createdPackage.food,
          accommodation: createdPackage.accommodation,
          travelCard: createdPackage.travelCard,
          utilityBills: createdPackage.utilityBills,
          airportPickup: createdPackage.airportPickup,
          jobGuidance: createdPackage.jobGuidance,
        },
      };
    } catch (error) {
      throw handleUseCaseError(error || "Failed to create package");
    }
  }
}

export class UpdatePackageUseCase {
  constructor(private packageRepository: PackageRepositoryImpl) {}

  async execute(data: UpdatePackageRequest): Promise<UpdatePackageResponse> {
    try {
      const { _id, ...updateData } = data;

      const existingPackage = await this.packageRepository.findPackageById(_id);
      if (!existingPackage) throw new Error("Package not found");

      const updatedPackage = new Package(
        existingPackage._id,
        updateData.packageName ?? existingPackage.packageName,
        updateData.description ?? existingPackage.description,
        updateData.priceIN ?? existingPackage.priceIN,
        updateData.priceUAE ?? existingPackage.priceUAE,
        updateData.packageType ?? existingPackage.packageType,
        updateData.packageDuration ?? existingPackage.packageDuration,
        updateData.image ?? existingPackage.image,
        updateData.features ?? existingPackage.features,
        updateData.food ?? existingPackage.food,
        updateData.accommodation ?? existingPackage.accommodation,
        updateData.travelCard ?? existingPackage.travelCard,
        updateData.utilityBills ?? existingPackage.utilityBills,
        updateData.airportPickup ?? existingPackage.airportPickup,
        updateData.jobGuidance ?? existingPackage.jobGuidance,
        existingPackage.createdAt,
        existingPackage.updatedAt
      );

      const result = await this.packageRepository.updatePackage(updatedPackage);
      if (!result) throw new Error("Failed to update package");

      return {
        success: true,
        message: "Package updated successfully",
        package: {
          _id: result._id,
          packageName: result.packageName,
          description: result.description,
          priceIN: result.priceIN,
          priceUAE: result.priceUAE,
          packageType: result.packageType,
          packageDuration: result.packageDuration,
          image: result.image,
          features: result.features,
          food: result.food,
          accommodation: result.accommodation,
          travelCard: result.travelCard,
          utilityBills: result.utilityBills,
          airportPickup: result.airportPickup,
          jobGuidance: result.jobGuidance,
        },
      };
    } catch (error) {
      throw handleUseCaseError(error || "Failed to update package");
    }
  }
}

export class DeletePackageUseCase {
  constructor(private packageRepository: PackageRepositoryImpl) {}

  async execute(data: DeletePackageRequest): Promise<ApiResponse> {
    try {
      const { packageId } = data;

      const existingPackage = await this.packageRepository.findPackageById(packageId);
      if (!existingPackage) throw new Error("Package not found");

      const deleted = await this.packageRepository.deletePackage(packageId);
      if (!deleted) throw new Error("Failed to delete package");

      return { success: true, message: "Package deleted successfully" };
    } catch (error) {
      throw handleUseCaseError(error || "Failed to delete package");
    }
  }
}

export class GetPackageByIdUseCase {
  constructor(private packageRepository: PackageRepositoryImpl) {}

  async execute(data: GetPackageByIdRequest): Promise<GetPackageByIdResponse> {
    try {
      const { packageId } = data;

      const packageData = await this.packageRepository.findPackageById(packageId);
      if (!packageData) throw new Error("Package not found");

      return {
        success: true,
        message: "Package retrieved successfully",
        package: {
          _id: packageData._id,
          packageName: packageData.packageName,
          description: packageData.description,
          priceIN: packageData.priceIN,
          priceUAE: packageData.priceUAE,
          packageType: packageData.packageType,
          packageDuration: packageData.packageDuration,
          image: packageData.image,
          features: packageData.features,
          food: packageData.food,
          accommodation: packageData.accommodation,
          travelCard: packageData.travelCard,
          utilityBills: packageData.utilityBills,
          airportPickup: packageData.airportPickup,
          jobGuidance: packageData.jobGuidance,
          createdAt: new Date(packageData.createdAt),
          updatedAt: new Date(packageData.updatedAt),
        },
      };
    } catch (error) {
      throw handleUseCaseError(error || "Failed to get package");
    }
  }
}

export class GetAllPackagesUseCase {
  constructor(private packageRepository: PackageRepositoryImpl) {}

  async execute(data: { page: number; limit: number }) {
    try {
      const result = await this.packageRepository.findAllPackages(data);
      return {
        success: true,
        message: "Packages retrieved successfully",
        ...result,
      };
    } catch (error) {
      throw handleUseCaseError(error || "Failed to get packages");
    }
  }
}

export class GetPackagesByTypeUseCase {
  constructor(private packageRepository: PackageRepositoryImpl) {}

  async execute(data: GetPackagesByTypeRequest) {
    try {
      const { packageType, page, limit } = data;
      const result = await this.packageRepository.findPackagesByType(packageType, { page, limit });
      return {
        success: true,
        message: `${packageType} packages retrieved successfully`,
        ...result,
      };
    } catch (error) {
      throw handleUseCaseError(error || "Failed to get packages by type");
    }
  }
}

export class GetPackageStatsUseCase {
  constructor(private packageRepository: PackageRepositoryImpl) {}

  async execute() {
    try {
      const totalPackages = await this.packageRepository.getTotalCount();
      return {
        success: true,
        message: "Package stats retrieved successfully",
        stats: { totalPackages },
      };
    } catch (error) {
      throw handleUseCaseError(error || "Failed to get package stats");
    }
  }
}