import { Upload } from "@aws-sdk/lib-storage";
import { aws_s3Config } from "../../config/env";
import { S3KeyGenerator } from "../helper/generateS3key";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

export interface UploadFileOptions {
  folder: string;
  userId: string;
  file: Express.Multer.File;
}

export class FileUploadService {
  constructor(
    private s3: S3Client,
    private s3KeyGenerator: S3KeyGenerator,
  ) { }

  async uploadFile({ folder, userId, file }: UploadFileOptions): Promise<string> {
    
    try {
      console.log("Uploading image")
      
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
    } catch (error) {
      console.log("image uploading error : ",error);
      throw new Error("uploadFile failed");
    }
  }
}


export class FileDeleteService {
  constructor(
    private s3: S3Client,
  ) { }

  async deleteFile(s3Key: string): Promise<boolean> {
    try {
      console.log("Deleting image");
      const command = new DeleteObjectCommand({
        Bucket: aws_s3Config.bucketName as string,
        Key: s3Key,
      });

      const result = await this.s3.send(command);
      console.log("deleting result : ",result);
      return true;
    } catch (error) {
      console.log("image deletion error : ",error);
      return true;
    }
  }
}