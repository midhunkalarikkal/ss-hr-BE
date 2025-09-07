import { z } from 'zod';

export const createUserByAdminSchema = z.object({
  fullName: z.string()
    .min(4, "Full name must be at least 4 characters")
    .max(30, "Full name must be at most 30 characters")
    .regex(/^[a-zA-Z\s]{4,30}$/, "Invalid full name"),
  email: z.string()
    .email("Invalid email format")
    .toLowerCase(),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be at most 100 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,100}$/, "Password must contain uppercase, lowercase, number and special character"),
  role: z.enum(['user', 'admin'], "Invalid role"),
  phone: z.string()
    .regex(/^\+?[0-9\s\-().]{7,20}$/, "Invalid phone number")
    .optional(),
  phoneTwo: z.string()
    .regex(/^\+?[0-9\s\-().]{7,20}$/, "Invalid phone number")
    .optional()
});

export const updateUserSchema = z.object({
  fullName: z.string()
    .min(4, "Full name must be at least 4 characters")
    .max(30, "Full name must be at most 30 characters")
    .regex(/^[a-zA-Z\s]{4,30}$/, "Invalid full name")
    .optional(),
  email: z.string()
    .email("Invalid email format")
    .toLowerCase()
    .optional(),
  phone: z.string()
    .regex(/^\+?[0-9\s\-().]{7,20}$/, "Invalid phone number")
    .optional(),
  phoneTwo: z.string()
    .regex(/^\+?[0-9\s\-().]{7,20}$/, "Invalid phone number")
    .optional(),
  isBlocked: z.boolean().optional(),
  isVerified: z.boolean().optional()
});

export const getUserByIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID")
});