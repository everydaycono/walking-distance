import { ArticleService } from './../article/article.service';
import { TagService } from '../tag/tag.service';
import { CategoryService } from './../category/category.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SearchService {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly tagService: TagService,
    private readonly articleService: ArticleService
  ) {}

  // search article in title,content
  async searchArticleByTitleOrContent(keyword) {
    return await this.articleService.search(keyword);
  }

  // search article by category
  async searchArticleByCategory(keyword) {
    return await this.categoryService.findByLabel(keyword);
  }

  // search article by tag
  async searchArticleByTag(keyword) {
    return await this.tagService.findByTag(keyword);
  }
}
