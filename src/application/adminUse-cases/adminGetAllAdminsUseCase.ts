import { handleUseCaseError } from "../../infrastructure/error/useCaseError";
import { AdminFetchAllAdmins } from "../../domain/repositories/IUserRepository";
import { UserRepositoryImpl } from "../../infrastructure/database/user/userRepositoryImpl";
import { ApiPaginationRequest, ApiResponse } from "../../infrastructure/dtos/common.dts";

export class AdminGetAllAdminsUseCase {
    constructor(
        private userRepositoryImpl: UserRepositoryImpl
    ) { }

    async execute(payload: ApiPaginationRequest): Promise<ApiResponse<AdminFetchAllAdmins>> {
        try {
            const admins = await this.userRepositoryImpl.findAllAdmins(payload);
            if(!admins) throw new Error("No admins found in databse");

            return { success: true, message: "Fetched all admins", data: admins as AdminFetchAllAdmins }
        } catch (error) {
            throw handleUseCaseError(error || "Unexpected error in AdminGetAllAdminsUseCase");
        }
    }
}