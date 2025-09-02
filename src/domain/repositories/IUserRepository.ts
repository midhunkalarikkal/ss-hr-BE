import { Types } from "mongoose";
import { Role, User } from "../entities/user";
import {ApiPaginationRequest,ApiResponse, FetchUsersForChatSideBar} from "../../infrastructure/dtos/common.dts";

export type CreateLocalUser = Pick<User,"fullName" | "email" | "password" | "verificationToken" | "role">;
export type CreateGoogleUser = Pick<User,"fullName" | "email" | "password" | "isVerified" | "verificationToken" | "role" | "phone" | "phoneTwo" | "profileImage" | "googleId">;
export type CreateAdmin = Pick<User,"fullName" | "email" | "password" | "isVerified" | "role" | "phone" | "profileImage">;
export type AdminFetchAllUsers = Array<Pick<User, "_id" | "fullName" | "email" | "isBlocked" | "isVerified">>;

export type CreateUserProps = CreateLocalUser | CreateGoogleUser | CreateAdmin;

export interface IUserRepository {
  createUser(user: CreateUserProps): Promise<User>;

  verifyUser(verificationToken: string): Promise<User | null>;

  updateUser(user: User): Promise<User | null>;

  findUserByEmail(email: string): Promise<User | null>;

  findUserByEmailWithRole(email: string, role: Role): Promise<User | null>;

  findAllUsers({page,limit,}: ApiPaginationRequest): Promise<ApiResponse<AdminFetchAllUsers>>;

  findUserById(userId: Types.ObjectId): Promise<User | null>;

  findUserByGoogleId(googleId: string): Promise<User | null>;

  findAllUsersForChatSidebar(isAdmin: boolean): Promise<FetchUsersForChatSideBar | null>
}
