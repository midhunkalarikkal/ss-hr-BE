import { s3Client } from '../../config/aws_s3';
import { aws_s3Config } from '../../config/env';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { SignedUrlRepositoryImpl } from '../database/signedUrl/signedUrlRepositoryImpl';

export class SignedUrlService {

  constructor(
    private bucketName: string = aws_s3Config.bucketName!,
    private signedUrlRepositoryImpl: SignedUrlRepositoryImpl
  ) { }
  async generateSignedUrl(s3Key: string, expires: number = 172800): Promise<string> {

    try {
      console.log("generateSignedUrl service");
      const existing = await this.signedUrlRepositoryImpl.findOneSignedUrl(s3Key);
      if (existing && existing.expiresAt > new Date()) {
        return existing.url;
      }

      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: s3Key,
      });

      const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: expires });
      const expiresAt = new Date(Date.now() + expires * 1000);

      const response = await this.signedUrlRepositoryImpl.findOneSignedUrlAndUpdate(s3Key, signedUrl, expiresAt);

      return signedUrl;
    } catch (error) {
      console.log("generateSignedUrl error : ",error);
      throw new Error("generateSignedUrl failed")
    }
  }
}
