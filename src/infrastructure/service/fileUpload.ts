import { Upload } from "@aws-sdk/lib-storage";
import { S3Client } from "@aws-sdk/client-s3";
import { aws_s3Config } from "../../config/env";
import { S3KeyGenerator } from "../helper/generateS3key";

export interface UploadFileOptions {
  folder: string;
  userId: string;
  file: Express.Multer.File;
}

export class FileUploadService {
  constructor(
    private s3: S3Client,
    private s3KeyGenerator: S3KeyGenerator,
) {}

  async uploadFile({ folder, userId, file }: UploadFileOptions): Promise<string> {

    const s3Key = await this.s3KeyGenerator.generateS3Key({
      folder,
      userId,
      originalname: file.originalname,
    });

    const params = {
      Bucket: aws_s3Config.bucketName as string,
      Key: s3Key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const upload = new Upload({
      client: this.s3,
      params,
    });

    await upload.done();
    return s3Key;
  }
}
