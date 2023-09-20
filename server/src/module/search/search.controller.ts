import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { CategoryType } from './types/category.type';

@ApiTags('🔎 Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  /**
   * search article by title or content
   */
  @ApiOperation({ summary: 'Search Article by Title or Content' })
  @ApiQuery({
    type: String,
    name: 'keyword',
    required: true,
    example: 'title'
  })
  @Get('/article')
  @HttpCode(HttpStatus.OK)
  searchArticleByTitleOrContent(@Query('keyword') keyword: string) {
    return this.searchService.searchArticleByTitleOrContent(keyword);
  }

  /**
   * search article by category
   */
  @ApiOperation({ summary: 'Search Article by Category' })
  @ApiQuery({
    type: String,
    name: 'label',
    enum: CategoryType,
    required: true
  })
  @Get('/article/category')
  @HttpCode(HttpStatus.OK)
  searchArticleByCategory(@Query('label') label: CategoryType) {
    return this.searchService.searchArticleByCategory(label);
  }

  /**
   * search article by tag
   */
  @ApiOperation({ summary: 'Search Article by Tag' })
  @ApiQuery({
    type: String,
    name: 'label',
    required: true
  })
  @Get('/article/tag')
  @HttpCode(HttpStatus.OK)
  searchArticleByTag(@Query('label') label: string) {
    return this.searchService.searchArticleByTag(label);
  }
}
