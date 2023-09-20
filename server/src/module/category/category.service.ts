import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  OnApplicationBootstrap
} from '@nestjs/common';
import { Category } from './category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoryService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}

  // onApplicationBootstrap called
  async onApplicationBootstrap() {
    await this.seed();
  }
  // create seed data
  private async seed() {
    try {
      // find all categories
      const existingCategories = await this.categoryRepository.find();

      // if no categories
      if (existingCategories.length === 0) {
        // 초기 데이터 추가
        await this.categoryRepository.save([
          { label: 'daily' },
          { label: 'exercise' },
          { label: 'study' },
          { label: 'tech' },
          { label: 'hobby' }
        ]);
      } else {
        // already maded categories, return
        return;
      }
    } catch (error) {
      console.error('Category seed data error', error);
      throw error;
    }
  }

  /**
   * create a new category
   */
  async create(category: Partial<Category>) {
    const { label } = category;

    // require label
    if (!label) {
      throw new BadRequestException('Label is required');
    }

    // find category by label
    const existCategory = await this.categoryRepository.findOne({
      where: {
        label
      }
    });

    // if exist  throw error
    if (existCategory) {
      throw new HttpException(
        'Category already exists',
        HttpStatus.BAD_REQUEST
      );
    }

    // create new category
    const newCategory = await this.categoryRepository.create(category);

    // save new category in database
    await this.categoryRepository.save(newCategory);
    return { newCategory };
  }

  /**
   * find all categories
   */
  async findAll() {
    return this.categoryRepository.find({
      relations: {
        articles: true
      }
    });
  }

  /**
   * find by id category
   */
  async findByLabel(label: string) {
    // find category by label in database
    const existCategory = await this.categoryRepository.findOne({
      where: {
        label
      },
      relations: ['articles']
    });

    // if no category database with current label
    if (!existCategory) {
      throw new HttpException(
        `Category not found ${label}`,
        HttpStatus.NOT_FOUND
      );
    }

    return existCategory;
  }

  /**
   * edit by id category
   */
  async editById(id: string, category: Partial<Category>) {
    const { label } = category;

    // find category by id in database
    const existCategory = this.categoryRepository.findOne({
      where: {
        id
      }
    });

    // if no category with current id
    if (!existCategory) {
      throw new BadRequestException(`Category not found ${id}`);
    }

    // no edit body
    if (!label) {
      return {
        message: 'no edit body'
      };
    }

    // edit single article
    await this.categoryRepository
      .createQueryBuilder()
      .update(Category)
      .set({ label })
      .where('id=:id', { id })
      .execute();

    return { message: 'successfully edited category' };
  }

  /**
   * delete by id category
   */
  async deleteById(id: string) {
    const existCategory = await this.categoryRepository.findOne({
      where: { id },
      relations: {
        articles: true
      }
    });

    // if no article with current id
    if (!existCategory) {
      throw new NotFoundException(`Category not found with id ${id}`);
    }

    // 현재 category를 사용하고있는 article이 있을경우 못지운다는 에러
    if (existCategory.articles.length !== 0) {
      throw new HttpException('Category has articles', HttpStatus.BAD_REQUEST);
    }

    // delete single category
    await this.categoryRepository.delete({ id });
    return { message: 'successfully deleted category' };
  }
}
