import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SearchService } from './search.service';

@ApiTags('🔎 Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  /**
   * search
   */
  @Get('/article')
  async searchArticle(@Query('keyword') keyword) {
    return await this.searchService.searchArticle('article', keyword);
  }
}
