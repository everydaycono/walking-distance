import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable
} from '@nestjs/common';
import { Category } from './category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}
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

    const newCategory = await this.categoryRepository.create(category);
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
  async findById(id: string) {
    const existCategory = await this.categoryRepository.findOne({
      where: {
        id
      },
      relations: {
        articles: true
      }
    });
    if (!existCategory) {
      throw new HttpException(`Category not found ${id}`, HttpStatus.NOT_FOUND);
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

    return { msg: 'successfully edited category' };
  }
}
