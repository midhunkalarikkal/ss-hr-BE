import { z } from "zod";
import { PaymentMethod, PaymentStatus } from "../../domain/entities/payment";

export const createPaymentSchema = z.object({
  customerId: z
    .string()
    .min(1, "Customer ID is required"),
  packageId: z
    .string()
    .min(1, "Package ID is required"),
  customerName: z
    .string()
    .min(2, "Customer name must be at least 2 characters")
    .max(100, "Customer name must be at most 100 characters")
    .trim(),
  packageName: z
    .string()
    .min(2, "Package name must be at least 2 characters")
    .max(100, "Package name must be at most 100 characters")
    .trim(),
  totalAmount: z
    .number()
    .min(0, "Total amount cannot be negative"),
  paidAmount: z
    .number()
    .min(0, "Paid amount cannot be negative")
    .default(0),
  paymentMethod: z.enum(['googlepay', 'banktransfer', 'cash']),
  paymentDate: z
    .string()
    .min(1, "Payment date is required"),
  referenceId: z
    .string()
    .min(3, "Reference ID must be at least 3 characters")
    .max(50, "Reference ID must be at most 50 characters")
    .trim(),
  paymentProof: z
    .string()
    .min(1, "Payment proof is required")
    .trim(),
  adminNotes: z
    .string()
    .max(500, "Admin notes must be at most 500 characters")
    .trim()
    .default(""),
}).refine((data) => data.paidAmount <= data.totalAmount, {
  message: "Paid amount cannot exceed total amount",
  path: ["paidAmount"],
});

export const updatePaymentSchema = z.object({
  customerId: z
    .string()
    .min(1, "Customer ID is required")
    .optional(),
  packageId: z
    .string()
    .min(1, "Package ID is required")
    .optional(),
  customerName: z
    .string()
    .min(2, "Customer name must be at least 2 characters")
    .max(100, "Customer name must be at most 100 characters")
    .trim()
    .optional(),
  packageName: z
    .string()
    .min(2, "Package name must be at least 2 characters")
    .max(100, "Package name must be at most 100 characters")
    .trim()
    .optional(),
  totalAmount: z
    .number()
    .min(0, "Total amount cannot be negative")
    .optional(),
  paidAmount: z
    .number()
    .min(0, "Paid amount cannot be negative")
    .optional(),
  paymentMethod: z.enum(['googlepay', 'banktransfer', 'cash']).optional(),
  paymentDate: z
    .string()
    .min(1, "Payment date is required")
    .optional(),
  referenceId: z
    .string()
    .min(3, "Reference ID must be at least 3 characters")
    .max(50, "Reference ID must be at most 50 characters")
    .trim()
    .optional(),
  paymentProof: z
    .string()
    .min(1, "Payment proof is required")
    .trim()
    .optional(),
  adminNotes: z
    .string()
    .max(500, "Admin notes must be at most 500 characters")
    .trim()
    .optional(),
}).refine((data) => {
  if (data.paidAmount !== undefined && data.totalAmount !== undefined) {
    return data.paidAmount <= data.totalAmount;
  }
  return true;
}, {
  message: "Paid amount cannot exceed total amount",
  path: ["paidAmount"],
});

export const paymentIdSchema = z.object({
  id: z.string().min(1, "Payment ID is required"),
});

export const customerIdSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
});

export const packageIdSchema = z.object({
  packageId: z.string().min(1, "Package ID is required"),
});

export const paymentStatusSchema = z.object({
  status: z.enum(['pending', 'partiallypaid', 'fullypaid']),
});