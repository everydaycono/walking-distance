import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AwsService } from '../oss/oss.service';

@Injectable()
export class UserService {
  constructor(private awsService: AwsService) {}

  // update avatar
  async updateAvatar(dataBuffer: Buffer, filename: string, fileType: string) {
    try {
      const uploadResult = await this.awsService.uploadPublicFile(
        dataBuffer,
        filename,
        fileType
      );
      return {
        message: 'updated done',
        uploadResult
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // get my articles
  getMyArticles(userId: string) {
    return 'get my articles';
  }

  // get other articles
  getPersonArticles(userId: string) {
    return 'get other articles';
  }
}
