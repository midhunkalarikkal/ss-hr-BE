import { handleUseCaseError } from "../../infrastructure/error/useCaseError";
import { SignedUrlService } from "../../infrastructure/service/generateSignedUrl";
import { UserRepositoryImpl } from "../../infrastructure/database/user/userRepositoryImpl";
import { ApiResponse, FetchUsersForChatSideBar } from "../../infrastructure/dtos/common.dts";

export class GetAllUsersForChatSideBarUseCase {
    constructor(
        private userRepositoryImpl: UserRepositoryImpl,
        private signedUrlService: SignedUrlService,
    ) { }

    async execute(isAdmin: boolean): Promise<ApiResponse<FetchUsersForChatSideBar>> {
        try {

            const result = await this.userRepositoryImpl.findAllUsersForChatSidebar(isAdmin);
            if (!result) throw new Error("No users found for the chat sidebar");

            const updatedResult = await Promise.all(
                result.map(async (user) => {
                    let profileImageUrl = user?.profileImage;

                    if (profileImageUrl) {
                        const signedUrl = await this.signedUrlService.generateSignedUrl(profileImageUrl);
                        user.profileImage = signedUrl;
                    }
                    return user;
                })
            )

            return { data: updatedResult }
        } catch (error) {
            throw handleUseCaseError(error || "Unexpected error in fetching chat users");
        }
    }
}