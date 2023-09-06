import { Module } from '@nestjs/common';
import { AwsController } from './oss.controller';
import { AwsService } from './oss.service';

@Module({
  controllers: [AwsController],
  providers: [AwsService],
  exports: [AwsService]
})
export class AwsModule {}
