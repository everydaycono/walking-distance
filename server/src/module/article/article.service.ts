import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Article } from "./article.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>
  ) {}
  /**
   * create article
   */
  async create(article: Article) {
    return "create article";
  }

  /**
   * get all articles
   */
  async getAllArticles() {
    return "get all articles";
  }

  /**
   * get single article
   */
  async getSingleArticle(id: string) {
    return `get single article ${id}`;
  }

  /**
   * edit single article
   */
  async editSingleArticle(id: string) {
    return `edit single article ${id}`;
  }

  /**
   * delete single article
   */
  async deleteSingleArticle(id: string) {
    return `delete single article ${id}`;
  }
}
