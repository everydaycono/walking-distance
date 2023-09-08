import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Article } from './article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryService } from '../category/category.service';
import { TagService } from '../tag/tag.service';
import { CustomArticleType } from './types/article.type';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    private readonly categoryService: CategoryService,
    private readonly tagService: TagService
  ) {}
  /**
   * create article
   */
  async create(article: CustomArticleType) {
    const { title, content, category, tags } = article;

    // require title and content
    if (!title || !content) {
      throw new BadRequestException('title and content are required');
    }

    // create new article
    const newArticle = await this.articleRepository.create({
      ...article
    });

    // find tag
    if (tags?.length > 0) {
      const existTag = await this.tagService.findAll(tags);
      newArticle.tags = existTag;
    }

    // find category
    if (category) {
      const existCategory = await this.categoryService.findByLabel(category);

      newArticle.category = existCategory;
    }

    // set status to publish
    newArticle.status = 'publish';

    // save new article
    await this.articleRepository.save(newArticle);

    return { msg: 'successfully created article' };
  }

  /**
   * get all articles
   */
  async getAllArticles() {
    // TODO: 추후 category, tag에 따른 sort, page, query 로직 추가
    const articles = await this.articleRepository.find({
      order: { createAt: 'DESC' },
      relations: ['category', 'tags']
    });

    // if no articles
    if (!articles || articles.length === 0) {
      throw new HttpException('no posted articles', HttpStatus.BAD_REQUEST);
    }

    // return all articles
    return articles;
  }

  /**
   * get single article
   */
  async getSingleArticle(id: string) {
    const article = await this.articleRepository.findOne({
      where: { id },
      relations: ['category', 'tags']
    });

    // if no article with current id
    if (!article) {
      throw new HttpException(
        `article not found with id ${id}`,
        HttpStatus.NOT_FOUND
      );
    }

    return article;
  }

  /**
   * edit single article
   */
  async editSingleArticle(id: string, article: CustomArticleType) {
    const { title, content, category, tags } = article;

    // find article by id in database
    const existArticle = await this.articleRepository.findOne({
      where: { id }
    });

    // if no article with current id
    if (!existArticle) {
      throw new HttpException(
        `article not found with id ${id}`,
        HttpStatus.NOT_FOUND
      );
    }

    // if no edit body
    if (!title && !content && !category && !tags) {
      return {
        message: 'no edit body'
      };
    }

    // Update the article fields
    if (title) {
      existArticle.title = title;
    }
    if (content) {
      existArticle.content = content;
    }

    // Assuming 'category' and 'tags' are ManyToOne or ManyToMany relations
    // find category
    if (category) {
      const existCategory = await this.categoryService.findByLabel(category);
      existArticle.category = existCategory;
    }

    // find tag
    if (tags?.length > 0) {
      const existTag = await this.tagService.findAll(tags);
      existArticle.tags = existTag;
    }

    // Save the updated article
    await this.articleRepository.save(existArticle);

    return { msg: 'successfully edited article' };
  }

  /**
   * delete single article
   */
  async deleteSingleArticle(id: string) {
    const existArticle = await this.articleRepository.findOne({
      where: { id }
    });

    // if no article with current id
    if (!existArticle) {
      throw new HttpException(
        `article not found with id ${id}`,
        HttpStatus.NOT_FOUND
      );
    }

    await this.articleRepository.delete({ id });
    return { msg: 'successfully deleted article' };
  }
}
