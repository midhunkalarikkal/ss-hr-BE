import { z } from "zod";
import { PackageType } from "../../domain/entities/package";

export const createPackageSchema = z.object({
  packageName: z
    .string()
    .min(2, "Package name must be at least 2 characters")
    .max(100, "Package name must be at most 100 characters")
    .trim(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be at most 1000 characters")
    .trim(),
  priceIN: z
    .string()
    .min(1, "Price in INR is required")
    .trim(),
  priceUAE: z
    .string()
    .min(1, "Price in AED is required")
    .trim(),
  packageType: z.enum(['jobpackage', 'tourpackage']),
  packageDuration: z
    .number()
    .min(1, "Package duration must be at least 1 day")
    .max(365, "Package duration must be at most 365 days"),
  image: z
    .string()
    .url("Invalid image URL")
    .min(1, "Package image is required"),
  features: z
    .array(z.string().trim().min(1, "Feature cannot be empty"))
    .min(1, "At least one feature is required"),
  food: z.boolean().default(false),
  accommodation: z.boolean().default(false),
  travelCard: z.boolean().default(false),
  utilityBills: z.boolean().default(false),
  airportPickup: z.boolean().default(false),
  jobGuidance: z.boolean().default(false),
});

export const updatePackageSchema = z.object({
  packageName: z
    .string()
    .min(2, "Package name must be at least 2 characters")
    .max(100, "Package name must be at most 100 characters")
    .trim()
    .optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be at most 1000 characters")
    .trim()
    .optional(),
  priceIN: z
    .string()
    .min(1, "Price in INR is required")
    .trim()
    .optional(),
  priceUAE: z
    .string()
    .min(1, "Price in AED is required")
    .trim()
    .optional(),
  packageType: z.enum(['jobpackage', 'tourpackage']).optional(),
  packageDuration: z
    .number()
    .min(1, "Package duration must be at least 1 day")
    .max(365, "Package duration must be at most 365 days")
    .optional(),
  image: z
    .string()
    .url("Invalid image URL")
    .min(1, "Package image is required")
    .optional(),
  features: z
    .array(z.string().trim().min(1, "Feature cannot be empty"))
    .min(1, "At least one feature is required")
    .optional(),
  food: z.boolean().optional(),
  accommodation: z.boolean().optional(),
  travelCard: z.boolean().optional(),
  utilityBills: z.boolean().optional(),
  airportPickup: z.boolean().optional(),
  jobGuidance: z.boolean().optional(),
});

export const packageIdSchema = z.object({
  id: z.string().min(1, "Package ID is required"),
});

export const packageTypeSchema = z.object({
  type: z.enum(['jobpackage', 'tourpackage']),
});