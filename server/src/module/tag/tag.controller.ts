import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import {
  ApiExcludeEndpoint,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
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

  @ApiExcludeEndpoint()
  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() tag: Partial<Tag>) {
    return this.tagService.create(tag);
  }

  /**
   * find all tag
   */
  @ApiOperation({ summary: 'Find all Tags' })
  @ApiQuery({
    type: [String],
    isArray: true,
    name: 'label',
    required: false,
    description: 'default : null',
    example: 'exercise'
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(@Query() queryParams): Promise<Tag[]> {
    return this.tagService.findAll(queryParams);
  }

  /**
   * find single tag
   */
  @ApiParam({
    name: 'id',
    description: 'find single Tag',
    required: true
  })
  @ApiOperation({ summary: 'Find single Tag' })
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.tagService.findById(id);
  }

  /**
   * edit single tag
   */
  @ApiExcludeEndpoint()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  editById(@Param('id') id: string, @Body() tag) {
    return this.tagService.editById(id, tag);
  }

  /**
   * delete single tag
   */
  @ApiExcludeEndpoint()
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  @Roles(Role.ADMIN)
  deleteById(@Param('id') id: string) {
    return this.tagService.deleteById(id);
  }
}
