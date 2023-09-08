import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Create Tag' })
  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard)
  create(@Body() tag: Partial<Tag>) {
    return this.tagService.create(tag);
  }

  /**
   * find all tag
   */
  @ApiResponse({ status: 200, description: 'find all tag', type: [Tag] })
  @ApiOperation({ summary: 'Find all Tags' })
  @Get()
  findAll(@Query() queryParams): Promise<Tag[]> {
    return this.tagService.findAll(queryParams);
  }

  /**
   * find single tag
   */
  @ApiResponse({ status: 200, description: 'find single tag', type: [Tag] })
  @ApiOperation({ summary: 'Find single Tag' })
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.tagService.findById(id);
  }

  /**
   * edit single tag
   */
  @ApiResponse({ status: 200, description: 'Edit single tag', type: [Tag] })
  @ApiOperation({ summary: 'Edit single Tag' })
  @UseGuards(JwtGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  editById(@Param('id') id: string, @Body() tag) {
    return this.tagService.editById(id, tag);
  }

  /**
   * delete single tag
   */
  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Delete single tag', type: [Tag] })
  @ApiOperation({ summary: 'Delete single Tag' })
  @UseGuards(JwtGuard)
  @Roles(Role.ADMIN)
  deleteById(@Param('id') id: string) {
    return this.tagService.deleteById(id);
  }
}
