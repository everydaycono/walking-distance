import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AwsService } from '../oss/oss.service';

@Injectable()
export class UserService {
  constructor(private awsService: AwsService) {}
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

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
