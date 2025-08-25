import { Types } from "mongoose";

export enum PackageType {
    jobPackage = "jobpackage",
    tourPackage = "tourpackage"
}

export class Package {
    constructor(
        public _id: Types.ObjectId,
        public packageName: string,
        public description: string,
        public priceIN: string,
        public priceUAE: string,
        public packageType: PackageType,
        public image: string,
        public features: string[],
        public createdAt: string,
        public updatedAt: string,
    ) { }
}