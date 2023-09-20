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
  async searchArticleTitleOrContent(@Query('keyword') keyword) {
    return await this.searchService.searchArticleTitleOrContent(
      'article',
      keyword
    );
  }
}
