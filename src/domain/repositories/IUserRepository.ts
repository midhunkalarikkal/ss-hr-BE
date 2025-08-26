import { Types } from "mongoose";
import { User } from "../entities/user";
import { ApiPaginationRequest, ApiResponse } from "../../infrastructure/dtos/common.dts";

export type CreateLocalUser = Pick<User, "fullName" | "email" | "password" | "verificationToken" | "role">;
export type CreateGoogleUser = {
  fullName: User["fullName"];
  email: User["email"];
};
export type CreateUserProps = CreateLocalUser | CreateGoogleUser;


export type AdminFetchAllUsers = Array<Pick<User, "_id" | "fullName" | "email" | "isBlocked" | "isVerified">>;


export interface IUserRepository {

  createUser(user: CreateUserProps): Promise<User>;

  verifyUser(verificationToken: string): Promise<User | null>;

  updateUser(user: User): Promise<User | null>;

  findUserByEmail(email: string): Promise<User | null>;

  findAllUsers({ page, limit }: ApiPaginationRequest): Promise<ApiResponse<AdminFetchAllUsers>>;

  findUserById(userId: Types.ObjectId): Promise<User | null>;

  findUserByGoogleId(googleId: string): Promise<User | null>;
}
