import { Message } from "../entities/message";
import { CommonRequest, GetAllMessageResponse, SendMessageRequestForRepository } from "../../infrastructure/dtos/message.dtos";

export interface IMessageRepository {

    getAllMessages(payload: CommonRequest): Promise<GetAllMessageResponse>;
    
    createMessage(payload: SendMessageRequestForRepository): Promise<Message>;
    
    // deleteMessage(data: CommonRequest): Promise<ApiResponse>;
}