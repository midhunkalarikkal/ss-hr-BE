import z from "zod";
import { enumField, stringField } from "./common.zod";
import { emailField, fullNameFiled, limitedRoleField, passwordField } from "./auth.zod";

// Regist controller zod validation
const CreateAdminZodSchema = z.object({
    fullName: fullNameFiled,
    email: emailField,
    password: passwordField,
    phone: stringField("Phone", 7, 20, /^\+?[0-9\s\-().]{7,20}$/, "Invalid phone number. Only digits, spaces, dashes (-), dots (.), parentheses (), and an optional + at the beginning are allowed. Length must be between 7 to 20 characters."),
    role: limitedRoleField,
    createrRole: enumField("creatorRole", ["superAdmin", "systemAdmin"])
});

export { CreateAdminZodSchema };