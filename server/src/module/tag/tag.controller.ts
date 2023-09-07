import { Body, Controller, Post, UseGuards } from '@nestjs/common';
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
  create(@Body() tag) {
    return this.tagService.create(tag);
  }
}
