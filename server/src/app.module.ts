import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './module/user/user.module';
import { AuthModule } from './module/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './module/mail/mail.module';
import { AwsModule } from './module/oss/oss.module';
import { ArticleModule } from './module/article/article.module';
import { CategoryModule } from './module/category/category.module';
import { CommentModule } from './module/comment/comment.module';
import { TagModule } from './module/tag/tag.module';
import { Article } from './module/article/article.entity';
import { Category } from './module/category/category.entity';
import { Comment } from './module/comment/entities/comment.entity';
import { Tag } from './module/tag/tag.entity';
import { User } from './module/user/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      entities: [User, Article, Category, Comment, Tag]
    }),
    UserModule,
    AuthModule,
    MailModule,
    AwsModule,
    ArticleModule,
    CategoryModule,
    CommentModule,
    TagModule
  ]
})
export class AppModule {}
