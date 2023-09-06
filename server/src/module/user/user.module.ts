import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AwsService } from '../oss/oss.service';
import { AwsModule } from '../oss/oss.module';

@Module({
  imports: [AwsModule],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
