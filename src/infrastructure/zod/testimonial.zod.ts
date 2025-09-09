import { z } from "zod";

export const createTestimonialSchema = z.object({
  clientName: z
    .string()
    .min(2, "Client name must be at least 2 characters")
    .max(100, "Client name must be at most 100 characters")
    .trim(),
  clientPhoto: z.string().url("Invalid photo URL").optional().or(z.literal("")),
  designation: z
    .string()
    .min(2, "Designation must be at least 2 characters")
    .max(100, "Designation must be at most 100 characters")
    .trim(),
  company: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must be at most 100 characters")
    .trim(),
  testimonial: z
    .string()
    .min(20, "Testimonial must be at least 20 characters")
    .max(1000, "Testimonial must be at most 1000 characters")
    .trim(),
});

export const updateTestimonialSchema = z.object({
  clientName: z
    .string()
    .min(2, "Client name must be at least 2 characters")
    .max(100, "Client name must be at most 100 characters")
    .trim()
    .optional(),
  clientPhoto: z.string().url("Invalid photo URL").optional().or(z.literal("")),
  designation: z
    .string()
    .min(2, "Designation must be at least 2 characters")
    .max(100, "Designation must be at most 100 characters")
    .trim()
    .optional(),
  company: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must be at most 100 characters")
    .trim()
    .optional(),
  testimonial: z
    .string()
    .min(20, "Testimonial must be at least 20 characters")
    .max(1000, "Testimonial must be at most 1000 characters")
    .trim()
    .optional(),
  isVisible: z.boolean().optional(),
});

export const testimonialIdSchema = z.object({
  id: z.string().min(1, "Testimonial ID is required"),
});