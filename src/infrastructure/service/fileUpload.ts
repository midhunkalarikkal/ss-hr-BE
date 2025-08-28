import { Upload } from "@aws-sdk/lib-storage";
import { S3Client } from "@aws-sdk/client-s3";
import { aws_s3Config } from "../../config/env";
import { SignedUrlService } from "./generateSignedUrl";
import { S3KeyGenerator } from "../helper/generates3key";

export interface UploadFileOptions {
  folder: string;
  userId: string;
  file: Express.Multer.File;
}

export class FileUploadService {
  constructor(
    private s3: S3Client,
    private signedUrlService: SignedUrlService,
    private s3KeyGenerator: S3KeyGenerator,
) {}

  async uploadFile({ folder, userId, file }: UploadFileOptions): Promise<string> {
    const params = {
      Bucket: aws_s3Config.bucketName as string,
      Key: await this.s3KeyGenerator.generateS3Key({
        folder,
        userId,
        originalname: file.originalname,
      }),
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const upload = new Upload({
      client: this.s3,
      params,
    });

    const s3UploadResponse = await upload.done();
    if (!s3UploadResponse) throw new Error("File upload failed");

    const fileUrl = s3UploadResponse.Location ?? "";
    return await this.signedUrlService.generateSignedUrl(fileUrl);
  }
}
