import { IMessage, MessageModel } from "./message.model";
import { Message } from "../../../domain/entities/message";
import { IMessageRepository } from "../../../domain/repositories/IMessage.repository";
import { CommonRequest, GetAllMessageResponse, SendMessageRequestForRepository } from "../../dtos/message.dtos";

export class MessageRepositoryImpl implements IMessageRepository {
    private mapToEntity(message: IMessage): Message {
        return new Message(
            message._id,
            message.senderId,
            message.receiverId,
            message.text,
            message.image,
            message.createdAt,
            message.updatedAt,
        )
    }

    async getAllMessages(payload: CommonRequest): Promise<GetAllMessageResponse> {
        const { fromUserId, toUserId } = payload;

        console.log("fromUserId : ",fromUserId);
        console.log("toUserId : ",toUserId);

        let messages = await MessageModel.find(
            {
            $or: [
                { senderId: fromUserId, receiverId: toUserId },
                { senderId: toUserId, receiverId: fromUserId },
            ]
        }
    ).lean();

        return messages.map(message => this.mapToEntity(message));
    }

    async createMessage(payload: SendMessageRequestForRepository): Promise<Message> {
        const newMessage = await MessageModel.create(payload);
        return this.mapToEntity(newMessage);
    }

    // deleteMessage(): Promise<ApiResponse> {

    // }
}