import { z } from "zod";

export const CreateJobZodSchema = z.object({
  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must be at most 100 characters")
    .trim(),
  designation: z
    .string()
    .min(2, "Designation must be at least 2 characters")
    .max(100, "Designation must be at most 100 characters")
    .trim(),
  vacancy: z
    .number()
    .int()
    .min(1, "Vacancy must be at least 1")
    .max(1000, "Vacancy cannot exceed 1000")
});

export const UpdateJobZodSchema = z.object({
  _id: z.string().min(1, "Job ID is required"),
  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must be at most 100 characters")
    .trim()
    .optional(),
  designation: z
    .string()
    .min(2, "Designation must be at least 2 characters")
    .max(100, "Designation must be at most 100 characters")
    .trim()
    .optional(),
  vacancy: z
    .number()
    .int()
    .min(1, "Vacancy must be at least 1")
    .max(1000, "Vacancy cannot exceed 1000")
    .optional()
});

export const GetJobByIdZodSchema = z.object({
  jobId: z.string().min(1, "Job ID is required")
});

export const DeleteJobZodSchema = z.object({
  jobId: z.string().min(1, "Job ID is required")
});


export const GetAllJobsZodSchema = z.object({
  page: z.string().optional().transform((val) => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform((val) => val ? parseInt(val, 10) : 10),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc')
});

export type GetAllJobsZodType = z.infer<typeof GetAllJobsZodSchema>;