import {Types} from "mongoose"
import { Package } from "../entities/package"
import {ApiPaginationRequest,ApiResponse} from "../../infrastructure/dtos/common.dts"


export type CreatePackage = Pick<Package,"packageName" | "description" | "priceIN" | "priceUAE" | "packageType" | "packageDuration" | "image" | "features" | "food" | "accommodation" | "travelCard" | "utilityBills" | "airportPickup" | "jobGuidance"> 
export type AdminFetchAllPackages = Array<Pick<Package,"_id"|"packageName"|"description"|"priceIN"|"priceUAE"|"packageType"|"packageDuration"|"image"|"features"|"food"|"accommodation"|"travelCard"|"utilityBills"|"airportPickup"|"jobGuidance"|"createdAt"|"updatedAt">>

export interface IPackageRepository {

    createPackage(packageData:CreatePackage):Promise<Package>;
    findAllPackages({page,limit}:ApiPaginationRequest):Promise<ApiResponse<AdminFetchAllPackages>>;
    findPackageById(packageId:Types.ObjectId):Promise<Package|null>;
    updatePackage(packageData:Package):Promise<Package | null>;
    deletePackage(packageId:Types.ObjectId):Promise<boolean>;
    getTotalCount():Promise<number>;
    findPackagesByType(packageType: string, {page,limit}:ApiPaginationRequest):Promise<ApiResponse<AdminFetchAllPackages>>

}