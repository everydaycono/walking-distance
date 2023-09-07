import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './tag.entity';
import { Repository } from 'typeorm';

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
  async findAll() {
    const tags = await this.tagRepository.find({
      relations: {
        articles: true
      }
    });
    return tags;
  }
}
