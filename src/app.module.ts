import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './module/user/user.module';
import { AuthModule } from './module/auth/auth.module';

import { config } from './config';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './module/mail/mail.module';
import { AwsModule } from './module/oss/oss.module';

const userEntity = config.dbEntity.User;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'conoblog',
      entities: [userEntity],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    MailModule,
    AwsModule,
  ],
})
export class AppModule {}
