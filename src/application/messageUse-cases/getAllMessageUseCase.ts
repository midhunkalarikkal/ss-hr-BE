import { ApiResponse } from "../../infrastructure/dtos/common.dts";
import { SignedUrlService } from "../../infrastructure/service/generateSignedUrl";
import { CommonRequest, GetAllMessageResponse } from "../../infrastructure/dtos/message.dtos";
import { MessageRepositoryImpl } from "../../infrastructure/database/message/message.repository.impl";


export class GetAllMessagesUseCase {
    constructor(
        private messageRepositoryImpl: MessageRepositoryImpl,
        private signedUrlService: SignedUrlService
    ) { }

    async execute(payload: CommonRequest): Promise<ApiResponse<GetAllMessageResponse>> {

        const { fromUserId, toUserId } = payload;

        let result = await this.messageRepositoryImpl.getAllMessages({ fromUserId, toUserId });

        result = await Promise.all(
            result.map(async (msg) => {
                if (msg.image) {
                    msg.image = await this.signedUrlService.generateSignedUrl(msg.image);
                }
                return msg;
            })
        );

        return { success: true, message: "Fetched messages", data: result }
    }
}