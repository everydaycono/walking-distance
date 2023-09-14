import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './tag.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>
  ) {}
  /**
   * create tag
   */
  async create(tag: Partial<Tag>) {
    const { label } = tag;

    // find tag by label
    const existTag = await this.tagRepository.findOne({ where: { label } });

    // if exist  throw error
    if (existTag) {
      throw new BadRequestException(` ${label}Tag already exists`);
    }

    const newTag = await this.tagRepository.create(tag);
    await this.tagRepository.save(newTag);

    return { message: 'Tag created successfully' };
  }

  /**
   * find all tag
   */
  async findAll(queryParams): Promise<Tag[]> {
    let tagLabels = queryParams;
    let tags;

    // queryParams가 object인 경우 key값꺼내서 배열로 만들기
    if (!Array.isArray(queryParams)) {
      tagLabels = Object.keys(queryParams);
    }
    // query filter해야하는게있어서 where in으로 array로 find
    if (tagLabels.length > 0) {
      tags = await this.tagRepository.find({
        where: {
          label: In(tagLabels)
        }
      });
      // queryParams이 존재하지않는경우 전체 결과 조회
    } else {
      tags = await this.tagRepository.find({
        relations: {
          articles: true
        }
      });
    }

    return tags;
  }

  /**
   * find by tag
   */
  async findById(id: string): Promise<Tag> {
    // find tag by id in database
    const existTag = await this.tagRepository.findOne({
      where: { id },
      relations: {
        articles: true
      }
    });

    // if not exist throw error
    if (!existTag) {
      throw new BadRequestException(`Tag not found ${id}`);
    }

    return existTag;
  }
  /**
   * edit single tag
   */
  async editById(id: string, tag: Partial<Tag>) {
    const { label } = tag;

    // find tag by id in database
    const existTag = await this.tagRepository.findOne({
      where: { id }
    });

    // if not exist throw error
    if (!existTag) {
      throw new NotFoundException(`Tag not found ${id}`);
    }

    // no edit body
    if (!label) {
      return 'no edit body';
    }

    // edit single tag
    await this.tagRepository
      .createQueryBuilder()
      .update(Tag)
      .set({ label })
      .where('id=:id', { id })
      .execute();

    return { message: 'successfully edited tag' };
  }

  /**
   * delete single tag
   */
  async deleteById(id: string) {
    // find tag by id in database
    const existTag = await this.tagRepository.findOne({
      where: { id },
      relations: {
        articles: true
      }
    });

    // if not exist throw error
    if (!existTag) {
      throw new NotFoundException(`Tag not found ${id}`);
    }

    // 현재 tag 사용하고 있는 article이 있을경우 못 지운다는 에러
    if (existTag?.articles?.length !== 0) {
      throw new BadRequestException('current tag has articles. cannot delete');
    }

    // delete single tag
    await this.tagRepository.remove(existTag);
    return { message: 'successfully deleted tag' };
  }
}
