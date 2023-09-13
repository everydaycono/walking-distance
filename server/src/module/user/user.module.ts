import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AwsModule } from '../oss/oss.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AwsModule],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
