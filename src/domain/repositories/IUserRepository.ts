import { Types } from "mongoose";
import { Role, User } from "../entities/user";
import {ApiPaginationRequest,ApiResponse, FetchUsersForChatSideBar} from "../../infrastructure/dtos/common.dts";

export type CreateLocalUser = Pick<User,"fullName" | "email" | "password" | "verificationToken" | "role" | "serialNumber">;
export type CreateLocalUserByAdmin = Pick<User,"fullName" | "email" | "serialNumber" | "password" | "role" | "phone" | "phoneTwo" | "isVerified" | "profileImage">;
export type CreateGoogleUser = Pick<User,"fullName" | "email" | "password" | "isVerified" | "verificationToken" | "role" | "phone" | "phoneTwo" | "profileImage" | "googleId">;
export type CreateAdmin = Pick<User,"fullName" | "email" | "password" | "isVerified" | "role" | "phone" | "profileImage" | "serialNumber">;
export type AdminFetchAllUsers = Array<Pick<User, "_id" | "serialNumber" | "fullName" | "email" | "isBlocked" | "isVerified" |"createdAt" | "profileImage">>;
export type AdminFetchAllAdmins= Array<Pick<User, "_id" | "fullName" | "email" | "isBlocked" | "createdAt" | "role" | "profileImage" | "phone">>;


export interface IUserRepository {
  createUser<T>(user: T): Promise<User>;

  verifyUser(verificationToken: string): Promise<User | null>;

  updateUser(user: User): Promise<User | null>;

  findUserByEmail(email: string): Promise<User | null>;

  findUserByEmailWithRole(email: string, role: Role): Promise<User | null>;

  findAllUsers({page,limit,}: ApiPaginationRequest): Promise<ApiResponse<AdminFetchAllUsers>>;

  findAllAdmins({page,limit,}: ApiPaginationRequest): Promise<ApiResponse<AdminFetchAllAdmins>>;

  findUserById(userId: Types.ObjectId): Promise<User | null>;

  findUserByGoogleId(googleId: string): Promise<User | null>;

  findAllUsersForChatSidebar(isAdmin: boolean): Promise<FetchUsersForChatSideBar | null>

  generateNextSerialNumber():Promise<string>;

  getTotalCount():Promise<number>;

  deleteUserById(id: Types.ObjectId): Promise<boolean>;
}
