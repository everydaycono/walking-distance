import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Article } from './article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryService } from '../category/category.service';
import { TagService } from '../tag/tag.service';
import { InputArticleType } from './types/article.type';
import { Tag } from '../tag/tag.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    private readonly categoryService: CategoryService,
    private readonly tagService: TagService
  ) {}
  /**
   * create article
   */
  async create(article: InputArticleType, userId: string) {
    const { title, content, category, tags } = article;
    const tagEntities: Tag[] = [];

    // require title and content
    if (!title || !content) {
      throw new BadRequestException('title and content are required');
    }

    // create new article
    const newArticle = await this.articleRepository.create({
      ...article,
      user: {
        id: userId
      }
    });

    // find category
    if (category) {
      await this.findByCategory(category, newArticle);
    }

    // create tag or find tag
    if (tags.length > 0) {
      for (const label of tags) {
        const tagEntity = await this.createOrGetTag(label);
        tagEntities.push(tagEntity);
      }
    }

    // set new article
    newArticle.status = 'publish';
    newArticle.tags = tagEntities;

    // save new article
    await this.articleRepository.save(newArticle);

    return { msg: 'successfully created article' };
  }

  /**
   * find by tag
   */
  async findByTag(tags, article) {
    const existTag = await this.tagService.findAll(tags);
    return (article.tags = existTag);
  }

  /**
   * create or get tag
   */
  async createOrGetTag(label: string) {
    // find tag in database
    let tagEntity = await this.tagRepository.findOne({
      where: { label }
    });

    // Tag가 존재하지 않으면 생성
    if (!tagEntity) {
      tagEntity = this.tagRepository.create({ label });
      await this.tagRepository.save(tagEntity);
    }

    return tagEntity;
  }

  /**
   * find by category
   */
  async findByCategory(category, article) {
    const existCategory = await this.categoryService.findByLabel(category);
    return (article.category = existCategory);
  }

  /**
   * get all articles
   */
  async getAllArticles() {
    // TODO: 추후 category, tag에 따른 sort, page, query 로직 추가
    const articles = await this.articleRepository.find({
      order: { createAt: 'DESC' },
      relations: ['category', 'tags', 'user'],
      select: {
        user: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          avatar: true
        }
      }
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
      relations: ['category', 'tags', 'user'],
      select: {
        user: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          avatar: true
        }
      }
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
  async editSingleArticle(id: string, article: InputArticleType) {
    const { title, content, category, tags } = article;

    // find article by id in database
    const existArticle = await this.articleRepository.findOne({
      where: { id }
    });

    // if no article with current id
    if (!existArticle) {
      throw new NotFoundException(`article not found with id ${id}`);
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

    // find category
    if (category) {
      await this.findByCategory(category, existArticle);
    }

    // find tag
    if (tags?.length > 0) {
      await this.findByTag(tags, existArticle);
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
