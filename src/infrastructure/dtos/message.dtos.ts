import { Types } from "mongoose";
import { Message } from "../../domain/entities/message";

export interface CommonRequest {
    fromUserId: Types.ObjectId,
    toUserId: Types.ObjectId,
}

// **** used in getAllMessage.use-case **** \\
// Used as the response type of the get all message usecase
export type GetAllMessageResponse = Array<Message>;


// **** used in sendMessage.use-case **** \\
// Used as the request type of the send message usecase
type SendMessage = Pick<Message, "senderId" | "receiverId" | "text" >;
interface MulterFile {
  originalname: string;
  buffer: Buffer;
  mimetype: string;
}
export interface SendMessageRequest extends SendMessage {
  file?: Express.Multer.File;
}
// Used as the request type of the create new message repository and repository implementation method
export interface SendMessageRequestForRepository
  extends Omit<SendMessageRequest, "file">,
    Partial<Pick<Message, "image">> {}
