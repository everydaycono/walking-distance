import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';

@Injectable()
export class AwsService {
  constructor(private configService: ConfigService) {}

  bucketName = this.configService.get('AWS_BUCKET_NAME');
  s3 = new S3({
    accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY')
  });

  async uploadPublicFile(
    dataBuffer: Buffer,
    filename: string,
    fileType: string
  ) {
    try {
      const uploadResult = await this.s3
        .upload({
          Bucket: this.bucketName,
          Body: dataBuffer,
          Key: `${Date.now()}-${filename}`,
          ACL: 'public-read',
          ContentType: fileType,
          ContentDisposition: 'inline'
        })
        .promise();

      return uploadResult;
    } catch (error) {
      console.log(error);
    }
  }
}
