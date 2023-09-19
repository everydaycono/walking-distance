import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException
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
    const { title, content, category, tags, status, thumbnail } = article;
    const tagEntities: Tag[] = [];

    // require title and content
    if (!title || !content || !category || !status) {
      throw new BadRequestException(
        'title, category, content, status of articles are all required'
      );
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
    if (tags?.length > 0) {
      for (const label of tags) {
        const tagEntity = await this.createOrGetTag(label);
        tagEntities.push(tagEntity);
      }
      newArticle.tags = tagEntities;
    }

    // article status에 따른 동작
    if (status === 'draft') {
      newArticle.status = 'draft';
    } else if (status === 'onlyme') {
      newArticle.status = 'onlyme';
    } else {
      newArticle.status = 'publish';
    }

    // set thumbnail
    if (thumbnail) {
      newArticle.thumbnail = thumbnail;
    }

    // save new article
    await this.articleRepository.save(newArticle);
    return { message: 'successfully created article' };
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
  async getAllArticles(status) {
    // find onlyme articles
    if (status === 'onlyme') {
      return this.findByStatusArticles('onlyme');
    }

    // find draft articles
    if (status === 'draft') {
      return this.findByStatusArticles('draft');
    }

    // find only published articles
    const articles = await this.articleRepository.find({
      where: {
        status: 'publish'
      },
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

    // article의 결과가 빈 배열일떄
    if (articles?.length === 0) {
      return [];
    }

    // if no articles
    if (!articles) {
      throw new HttpException('no posted articles', HttpStatus.BAD_REQUEST);
    }

    // return all articles
    return articles;
  }

  /**
   * find articles by status
   */
  async findByStatusArticles(status) {
    // find articles by status
    const articles = await this.articleRepository.find({
      where: {
        status
      },
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

    // if no articles return []
    if (!articles || articles?.length === 0) {
      return [];
    }

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
  async editSingleArticle(
    articleId: string,
    article: InputArticleType,
    userId: string
  ) {
    const { title, content, category, tags, status, thumbnail } = article;
    const tagEntities: Tag[] = [];

    // find article by id in database
    const existArticle = await this.articleRepository.findOne({
      where: { id: articleId },
      relations: ['user', 'category', 'tags'],
      select: {
        user: {
          id: true
        }
      }
    });

    // if no article with current id
    if (!existArticle) {
      throw new NotFoundException(`article not found with id ${articleId}`);
    }

    // article이 주인이 아닐때 throw exception
    if (existArticle.user.id !== userId) {
      throw new UnauthorizedException(
        'Unauthorized access. you are not owner this article.'
      );
    }

    // if no edit body
    if (!title && !content && !category && !tags) {
      return {
        message: 'no edit body'
      };
    }

    // update the article by status
    if (status === 'onlyme') {
      existArticle.status = 'onlyme';
    } else if (status === 'draft') {
      existArticle.status = 'draft';
    } else {
      existArticle.status = 'publish';
    }

    // Update the article fields
    if (title) {
      existArticle.title = title;
    }
    if (content) {
      existArticle.content = content;
    }

    // find category if no exist throw error
    if (category) {
      await this.findByCategory(category, existArticle);
    }

    // create tag or find tag
    if (tags?.length > 0) {
      for (const label of tags) {
        const tagEntity = await this.createOrGetTag(label);
        tagEntities.push(tagEntity);
      }
      existArticle.tags = tagEntities;
    }

    // set thumbnail
    if (thumbnail) {
      existArticle.thumbnail = thumbnail;
    }

    // Save the updated article
    await this.articleRepository.save(existArticle);

    return { message: 'successfully edited article' };
  }

  /**
   * delete single article
   */
  async deleteSingleArticle(articleId: string, userId: string) {
    const existArticle = await this.articleRepository.findOne({
      where: { id: articleId },
      relations: ['user'],
      select: {
        user: {
          id: true
        }
      }
    });

    // article이 주인이 아닐때 throw exception
    if (existArticle.user.id !== userId) {
      throw new UnauthorizedException(
        'Unauthorized access. you are not owner this article.'
      );
    }

    // if no article with current id
    if (!existArticle) {
      throw new HttpException(
        `article not found with id ${articleId}`,
        HttpStatus.NOT_FOUND
      );
    }

    await this.articleRepository.delete({ id: articleId });
    return { message: 'successfully deleted article' };
  }
}
