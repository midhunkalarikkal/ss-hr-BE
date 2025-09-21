import { Types } from "mongoose";
import { RandomStringGenerator } from "./generateRandomString";

interface GenerateS3KeyParams {
  folder: string;
  userId: Types.ObjectId | string;
  originalname: string;
}

export class S3KeyGenerator {
  constructor(
    private randomStringGenerator: RandomStringGenerator
  ) { }
  generateS3Key({ folder, userId, originalname }: GenerateS3KeyParams): string {
    const trimmedFileName = originalname.replace(/\s+/g, "_");
    const fileExtension = trimmedFileName.split(".").pop() ?? "";
    const baseName =
      trimmedFileName.substring(0, trimmedFileName.lastIndexOf(".")) || "file";
    const timestamp = Date.now();
    const randomStr = this.randomStringGenerator.generate();

    return `${folder}/${userId}_${baseName}_${timestamp}_${randomStr}.${fileExtension}`;
  }
}
