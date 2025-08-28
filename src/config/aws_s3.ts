import { aws_s3Config } from './env';
import { S3Client } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: aws_s3Config.region!,
  credentials: {
    accessKeyId: aws_s3Config.accessKeyId!,
    secretAccessKey: aws_s3Config.secretAccessKey!,
  },
});

export { s3Client };