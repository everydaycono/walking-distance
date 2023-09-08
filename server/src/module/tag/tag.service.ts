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

    return newTag;
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
      tags = await this.tagRepository.find();
    }

    return tags;
  }

  /**
   * find by tag
   */
  async findById(id: string) {
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
}
