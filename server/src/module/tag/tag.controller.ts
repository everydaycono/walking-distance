import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guard/roles.guard';
import { TagService } from './tag.service';
import { Tag } from './tag.entity';
import { Roles } from '../auth/decorators/roles.decorators';
import { Role } from '../auth/role.enum';
import { JwtGuard } from '../auth/guard/access-jwt.guard';

@ApiTags('Tag')
@Controller('tag')
@UseGuards(RolesGuard)
export class TagController {
  constructor(private readonly tagService: TagService) {}

  /**
   * create tag
   */
  @ApiResponse({ status: 201, description: 'create tag', type: [Tag] })
  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard)
  create(@Body() tag: Partial<Tag>): Promise<Tag> {
    return this.tagService.create(tag);
  }

  /**
   * find all tag
   */
  @Get()
  findAll() {
    return this.tagService.findAll();
  }

  /**
   * find single tag
   */
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.tagService.findById(id);
  }
}
