import { Types } from "mongoose";
import { Request, Response } from "express";
import { DecodedUser } from "../../express";
import { S3Client } from "@aws-sdk/client-s3";
import { aws_s3Config } from "../../config/env";
import { HandleError } from "../../infrastructure/error/error";
import { S3KeyGenerator } from "../../infrastructure/helper/generateS3key";
import { FileUploadService } from "../../infrastructure/service/fileUpload";
import { SignedUrlService } from "../../infrastructure/service/generateSignedUrl";
import { RandomStringGenerator } from "../../infrastructure/helper/generateRandomString";
import { SendMessageUseCase } from "../../application/messageUse-cases/sendMessage.UseCase";
import { GetAllMessagesUseCase } from "../../application/messageUse-cases/getAllMessageUseCase";
import { MessageRepositoryImpl } from "../../infrastructure/database/message/message.repository.impl";
import { SignedUrlRepositoryImpl } from "../../infrastructure/database/signedUrl/signedUrlRepositoryImpl";
import { commonParamsZodSchema, sendMessageRequestZodSchema } from "../../infrastructure/zod/message.zod";

const s3Client = new S3Client();
const messageRepositoryIml = new MessageRepositoryImpl();
const signedUrlRepositoryImpl = new SignedUrlRepositoryImpl();
const randomStringGenerator = new RandomStringGenerator();
const s3KeyGenerator = new S3KeyGenerator(randomStringGenerator);
const signedUrlService = new SignedUrlService(aws_s3Config.bucketName, signedUrlRepositoryImpl);
const fileUploadService = new FileUploadService(s3Client, s3KeyGenerator);

const sendMessageUseCase = new SendMessageUseCase(messageRepositoryIml, signedUrlService, fileUploadService);
const getAllMessagesUseCase = new GetAllMessagesUseCase(messageRepositoryIml, signedUrlService);

export class MessageController {
    constructor(
        private getAllMessagesUseCase: GetAllMessagesUseCase,
        private sendMessageUseCase: SendMessageUseCase,
    ) {
        this.getMessages = this.getMessages.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }

    async getMessages(req: Request, res: Response) {
        try {
            const validateParams = commonParamsZodSchema.parse(req.params);
            const { toUserId } = validateParams;
            const fromUserId = (req.user as DecodedUser).userId;
            const result = await this.getAllMessagesUseCase.execute({ fromUserId: new Types.ObjectId(fromUserId), toUserId: new Types.ObjectId(toUserId) });
            res.status(200).json(result);
        } catch (error) {
            console.log("Error : ",error);
            HandleError.handle(error, res);
        }
    }

    async sendMessage(req: Request, res: Response) {
        try {
            const fromUserId = (req.user as DecodedUser).userId;
            const validateParams = commonParamsZodSchema.parse(req.params);
            const { toUserId } = validateParams;
            const validateData = sendMessageRequestZodSchema.parse(req.body);
            const { text } = validateData;
            const file = req.file;
            const result = await this.sendMessageUseCase.execute({
                senderId: new Types.ObjectId(fromUserId),
                receiverId: new Types.ObjectId(toUserId),
                file: file,
                text: text
            });
            res.status(200).json(result);
        } catch (error) {
            console.log("error : ", error);
            HandleError.handle(error, res);
        }
    }
}

const messageController = new MessageController(getAllMessagesUseCase,sendMessageUseCase);
export { messageController };