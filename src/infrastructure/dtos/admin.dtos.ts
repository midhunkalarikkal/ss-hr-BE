import { User } from "../../domain/entities/user";

export type CreateAdminRequest = Pick<User, "fullName" | "email" | "password" | "phone" | "role"> & {
    profileImage?: Express.Multer.File
};

export type CreateAdminResponse = Pick<User, "_id" | "fullName" | "email" | "password" | "phone" | "profileImage" | "role" | "isBlocked">;