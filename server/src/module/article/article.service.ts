import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
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
  async create(article: Partial<Article>): Promise<Article> {
    const { title, content } = article;

    // require title and content
    if (!title || !content) {
      throw new BadRequestException("title and content are required");
    }

    // create new article
    const newArticle = await this.articleRepository.create({ ...article });

    // set status to publish
    newArticle.status = "publish";

    // save new article
    await this.articleRepository.save(newArticle);
    return newArticle;
  }

  /**
   * get all articles
   */
  async getAllArticles() {
    // TODO: 추후 category, tag에 따른 sort, page, query 로직 추가
    const articles = await this.articleRepository.find({
      order: { createAt: "DESC" },
    });

    // if no articles
    if (!articles || articles.length === 0) {
      throw new HttpException("no posted articles", HttpStatus.BAD_REQUEST);
    }

    // return all articles
    return articles;
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
