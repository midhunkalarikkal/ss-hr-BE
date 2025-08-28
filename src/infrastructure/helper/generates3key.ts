import { Types } from "mongoose";
import { generateRandomString } from "./generateRandomString";

interface GenerateS3KeyParams {
  folder: string;
  userId: Types.ObjectId | string;
  originalname: string;
}

export class S3KeyGenerator {
  generateS3Key({ folder, userId, originalname }: GenerateS3KeyParams): string {
    const trimmedFileName = originalname.replace(/\s+/g, "_");
    const fileExtension = trimmedFileName.split(".").pop() ?? "";
    const baseName =
      trimmedFileName.substring(0, trimmedFileName.lastIndexOf(".")) || "file";
    const timestamp = Date.now();
    const randomStr = generateRandomString();

    return `${folder}/${userId}_${baseName}_${timestamp}_${randomStr}.${fileExtension}`;
  }
}
