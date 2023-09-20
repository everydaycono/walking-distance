import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SearchService } from './search.service';

@ApiTags('🔎 Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  /**
   * search article by title or content
   */
  @Get('/article')
  searchArticleByTitleOrContent(@Query('keyword') keyword) {
    return this.searchService.searchArticleByTitleOrContent(keyword);
  }

  /**
   * search article by category
   */
  @Get('/article/category')
  searchArticleByCategory(@Query('keyword') keyword) {
    return this.searchService.searchArticleByCategory(keyword);
  }

  /**
   * search article by tag
   */
  @Get('/article/tag')
  searchArticleByTag(@Query('keyword') keyword) {
    return this.searchService.searchArticleByTag(keyword);
  }
}
