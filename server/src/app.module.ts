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
import { Comment } from './module/comment/comment.entity';
import { Tag } from './module/tag/tag.entity';
import { User } from './module/user/user.entity';
import { SearchModule } from './module/search/search.module';

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
      synchronize: process.env.NODE_ENV === 'dev' ? true : false,
      ssl: {
        // 개발 환경에서만 rejectUnauthorized를 false로 설정
        rejectUnauthorized: process.env.NODE_ENV !== 'dev'
      },
      entities: [User, Article, Category, Comment, Tag]
    }),
    UserModule,
    AuthModule,
    MailModule,
    AwsModule,
    ArticleModule,
    CategoryModule,
    CommentModule,
    TagModule,
    SearchModule
  ]
})
export class AppModule {}
