import { Injectable } from '@nestjs/common';

import { ArticleService } from '../article/article.service';

@Injectable()
export class SearchService {
  constructor(private readonly articleService: ArticleService) {}

  // search article
  async searchArticleTitleOrContent(type, keyword) {
    return await this.articleService.search(keyword);
  }
}
