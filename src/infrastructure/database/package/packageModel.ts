import mongoose, { Document, Schema, Types } from "mongoose";
import { PackageType } from "../../../domain/entities/package";

export interface IPackage extends Document {
  _id: Types.ObjectId;
  packageName: string;
  description: string;
  priceIN: string;
  priceUAE: string;
  packageType: PackageType;
  packageDuration: number;
  image: string;
  features: string[];
  food: boolean;
  accommodation: boolean;
  travelCard: boolean;
  utilityBills: boolean;
  airportPickup: boolean;
  jobGuidance: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PackageSchema = new Schema<IPackage>({
  packageName: {
    type: String,
    required: [true, "Package name is required"],
    minLength: [2, "Package name must be at least 2 characters"],
    maxlength: [100, "Package name must be at most 100 characters"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    minLength: [10, "Description must be at least 10 characters"],
    maxlength: [1000, "Description must be at most 1000 characters"],
    trim: true,
  },
  priceIN: {
    type: String,
    required: [true, "Price in INR is required"],
    trim: true,
  },
  priceUAE: {
    type: String,
    required: [true, "Price in AED is required"],
    trim: true,
  },
  packageType: {
    type: String,
    enum: Object.values(PackageType),
    required: [true, "Package type is required"],
  },
  packageDuration: {
    type: Number,
    required: [true, "Package duration is required"],
    min: [1, "Package duration must be at least 1 day"],
    max: [365, "Package duration must be at most 365 days"],
  },
  image: {
    type: String,
    required: [true, "Package image is required"],
    trim: true,
  },
  features: [{
    type: String,
    trim: true,
  }],
  food: {
    type: Boolean,
    default: false,
  },
  accommodation: {
    type: Boolean,
    default: false,
  },
  travelCard: {
    type: Boolean,
    default: false,
  },
  utilityBills: {
    type: Boolean,
    default: false,
  },
  airportPickup: {
    type: Boolean,
    default: false,
  },
  jobGuidance: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true
});

export const PackageModel = mongoose.model<IPackage>("Package", PackageSchema);