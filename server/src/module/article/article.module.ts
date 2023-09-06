import { Module } from "@nestjs/common";
import { ArticleController } from "./article.controller";
import { ArticleService } from "./article.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Article } from "./article.entity";
import { CategoryModule } from "../category/category.module";

@Module({
  imports: [TypeOrmModule.forFeature([Article]), CategoryModule],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
