import { z } from 'zod';

export const fullNameFiled = z.string()
  .min(4, "FullName must be at least 4 characters")
  .max(30, "FullName must be at most 30 characters")
  .regex(/^[a-zA-Z ]{4,30}$/, "Invalid username");

export const emailField = z.string().email("Invalid email format");

export const passwordField = z.string()
  .min(8, "Password must be at least 8 characters")
  .max(50, "Password must be at most 50 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,50}$/,
    "Invalid password"
  );

export const roleField = z.enum(["USER", "PROVIDER", "ADMIN"] as const);

export const limitedRoleField = z.enum(["user", "admin", "superAdmin"]);

export const otpField = z.string().length(6, "OTP must be exactly 6 characters");

export const verificationTokenField = z.string();

// Regist controller zod validation
const RegisterZodSchema = z.object({
  fullName: fullNameFiled,
  email: emailField,
  password: passwordField,
  role: limitedRoleField
});

// OTP Verification controller zod validation
const OTPVerificationZodSchema = z.object({
  otp: otpField,
  verificationToken: verificationTokenField,
  role: limitedRoleField
});

// Resend otp controller zod validation
const ResendOTPZodSchema = z.object({
  role: limitedRoleField,
  verificationToken: verificationTokenField.optional(),
  email: emailField.optional()
});

// Login controller zod validation
const LoginZodSchema = z.object({
  email: emailField,
  password: passwordField,
  role: roleField
});

// Update password zod validation
const UpdatePasswordZodSchema = z.object({
  role: limitedRoleField,
  verificationToken: verificationTokenField.optional(),
  password: passwordField
});

export {
    RegisterZodSchema,
    OTPVerificationZodSchema,
    ResendOTPZodSchema,
    LoginZodSchema,
    UpdatePasswordZodSchema
};
