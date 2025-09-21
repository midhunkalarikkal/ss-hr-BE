import { Types } from "mongoose";
import { ApiResponse } from "./common.dts";
import { PackageType } from "../../domain/entities/package";

// Create Package DTOs
export interface CreatePackageRequest {
  packageName: string;
  description: string;
  priceIN: string;
  priceUAE: string;
  packageType: PackageType;
  packageDuration: number;
  features: string[];
  food: boolean;
  accommodation: boolean;
  travelCard: boolean;
  utilityBills: boolean;
  airportPickup: boolean;
  jobGuidance: boolean;
}

export interface CreatePackageResponse extends ApiResponse {
  package?: {
    _id: Types.ObjectId;
    packageName: string;
    description: string;
    priceIN: string;
    priceUAE: string;
    packageType: PackageType;
    packageDuration: number;
    features: string[];
    food: boolean;
    accommodation: boolean;
    travelCard: boolean;
    utilityBills: boolean;
    airportPickup: boolean;
    jobGuidance: boolean;
  };
}

// Update Package DTOs
export interface UpdatePackageRequest {
  _id: Types.ObjectId;
  packageName?: string;
  description?: string;
  priceIN?: string;
  priceUAE?: string;
  packageType?: PackageType;
  packageDuration?: number;
  features?: string[];
  food?: boolean;
  accommodation?: boolean;
  travelCard?: boolean;
  utilityBills?: boolean;
  airportPickup?: boolean;
  jobGuidance?: boolean;
}

export interface UpdatePackageResponse extends ApiResponse {
  package?: {
    _id: Types.ObjectId;
    packageName: string;
    description: string;
    priceIN: string;
    priceUAE: string;
    packageType: PackageType;
    packageDuration: number;
    features: string[];
    food: boolean;
    accommodation: boolean;
    travelCard: boolean;
    utilityBills: boolean;
    airportPickup: boolean;
    jobGuidance: boolean;
  };
}

// Get Package DTOs
export interface GetPackageByIdRequest {
  packageId: Types.ObjectId;
}

export interface GetPackageByIdResponse extends ApiResponse {
  package?: {
    _id: Types.ObjectId;
    packageName: string;
    description: string;
    priceIN: string;
    priceUAE: string;
    packageType: PackageType;
    packageDuration: number;
    features: string[];
    food: boolean;
    accommodation: boolean;
    travelCard: boolean;
    utilityBills: boolean;
    airportPickup: boolean;
    jobGuidance: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
}

// Delete Package DTOs
export interface DeletePackageRequest {
  packageId: Types.ObjectId;
}

// Get Packages by Type DTOs
export interface GetPackagesByTypeRequest {
  packageType: string;
  page: number;
  limit: number;
}