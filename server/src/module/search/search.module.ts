import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { CategoryModule } from '../category/category.module';
import { TagModule } from '../tag/tag.module';
import { ArticleModule } from '../article/article.module';

@Module({
  imports: [CategoryModule, TagModule, ArticleModule],
  controllers: [SearchController],
  providers: [SearchService]
})
export class SearchModule {}
