import { ArticleService } from './../article/article.service';
import { TagService } from '../tag/tag.service';
import { CategoryService } from './../category/category.service';
import { Injectable } from '@nestjs/common';
import { CategoryType } from './types/category.type';

@Injectable()
export class SearchService {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly tagService: TagService,
    private readonly articleService: ArticleService
  ) {}

  // search article in title,content
  async searchArticleByTitleOrContent(keyword: string) {
    return await this.articleService.search(keyword);
  }

  // search article by category
  async searchArticleByCategory(label: CategoryType) {
    return await this.categoryService.findByLabel(label);
  }

  // search article by tag
  async searchArticleByTag(label: string) {
    return await this.tagService.findByTag(label);
  }
}
