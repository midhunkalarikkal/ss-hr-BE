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

  industry: z
    .string()
    .min(2, "Industry must be at least 2 characters")
    .max(100, "Industry must be at most 100 characters")
    .trim(),

  jobDescription: z
    .string()
    .min(10, "Job description must be at least 10 characters"),

  benifits: z
    .string()
    .min(2, "Benefits must be at least 2 characters"),

  salary: z
     .number()
    .int()
    .min(1, "Salary must be at least 1")
    .max(100, "Salary cannot exceed 1000"),

  skills: z
    .string()
    .min(2, "Skills must be at least 2 characters"),

  nationality: z
    .string()
    .min(2, "Nationality must be at least 2 characters"),

  vacancy: z
    .number()
    .int()
    .min(1, "Vacancy must be at least 1")
    .max(1000, "Vacancy cannot exceed 1000"),
});