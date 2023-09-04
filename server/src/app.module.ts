import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserModule } from "./module/user/user.module";
import { AuthModule } from "./module/auth/auth.module";

import { config } from "./config";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MailModule } from "./module/mail/mail.module";
import { AwsModule } from "./module/oss/oss.module";
import { ArticleModule } from "./module/article/article.module";

const userEntity = config.dbEntity.User;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [userEntity],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    MailModule,
    AwsModule,
    ArticleModule,
  ],
})
export class AppModule {}
