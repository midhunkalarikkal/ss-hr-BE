import { Message } from "../../domain/entities/message";
import { ApiResponse } from "../../infrastructure/dtos/common.dts";
import { FileUploadService } from "../../infrastructure/service/fileUpload";
import { SendMessageRequest } from "../../infrastructure/dtos/message.dtos";
import { getReceiverSocketId, io } from "../../infrastructure/lib/socket.io";
import { SignedUrlService } from "../../infrastructure/service/generateSignedUrl";
import { MessageRepositoryImpl } from "../../infrastructure/database/message/message.repository.impl";


export class SendMessageUseCase {
    constructor(
        private messageRepositoryImpl: MessageRepositoryImpl,
        private signedUrlService: SignedUrlService,
        private fileUploadService: FileUploadService,
    ) { }

    async execute(payload: SendMessageRequest): Promise<ApiResponse<Message>> {
        try {
            const { senderId, receiverId, text, file } = payload;
            
            let imageKey: string | undefined;
            if (file) {
                imageKey = await this.fileUploadService.uploadFile({
                    folder: `slotflow-chat-${senderId+"to"+receiverId}`,
                    userId: senderId.toString(),
                    file: file,
                });
            }
            
            const newMessage = await this.messageRepositoryImpl.createMessage({
                senderId,
                receiverId,
                text,
                image: imageKey
            });
            
            if (newMessage.image) {
                newMessage.image = await this.signedUrlService.generateSignedUrl(newMessage.image);
            }
            
            const receiverSocketId = await getReceiverSocketId(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newMessage", newMessage);
            }
            
            return { data: newMessage }
        } catch (error) {
            console.log("Send message error : ",error);
            throw new Error("Failed send to message");
        }

    }
}