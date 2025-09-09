import { User } from "../../domain/entities/user";

export interface CommonResponse {
  success?: boolean;
  message?: string;
}


export interface ApiPaginationRequest {
    page: number;
    limit: number;
}

export interface ApiResponse<T = unknown> extends CommonResponse{
    totalPages?: number;
    currentPage?: number;
    totalCount?: number;
    data?: T;
}


export type FetchUsersForChatSideBar = Array<Pick<User, "_id" | "fullName" | "profileImage">>;