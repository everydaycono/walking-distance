import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AwsService } from '../oss/oss.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    private awsService: AwsService,
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

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
  async getMyArticles(userId: string) {
    // find article by userId
    const havingArticles = await this.userRepository.find({
      where: { id: userId },
      relations: ['articles']
    });

    // 가지고있는 article이 없는 경우
    if (havingArticles.length === 0) {
      return [];
    }

    return havingArticles;
  }

  // get other articles
  async getPersonArticles(userId: string) {
    // find article by userId
    const havingArticles = await this.userRepository.find({
      where: { id: userId },
      relations: ['articles']
    });
    // TODO: 다른 사람들 게시물 공개인 경우의 게시글만 불러오기 로직 추가

    // 가지고있는 article이 없는 경우
    if (havingArticles.length === 0) {
      return [];
    }

    return havingArticles;
  }
}
