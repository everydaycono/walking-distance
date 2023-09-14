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
  UseGuards
} from '@nestjs/common';
import {
  ApiExcludeEndpoint,
  ApiOperation,
  ApiParam,
  ApiTags
} from '@nestjs/swagger';
import { Category } from './category.entity';
import { Roles } from '../auth/decorators/roles.decorators';
import { JwtGuard } from '../auth/guard/access-jwt.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Role } from '../auth/role.enum';
import { CategoryService } from './category.service';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  /**
   * create a new category
   */
  @ApiOperation({ summary: 'Create category' })
  @ApiExcludeEndpoint()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtGuard)
  create(@Body() category: Partial<Category>) {
    return this.categoryService.create(category);
  }

  /**
   * get all categories
   */
  @ApiOperation({ summary: 'Get all categories' })
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.categoryService.findAll();
  }

  /**
   * get single categories
   */
  @ApiParam({
    name: 'label',
    description: '카테고리 라벨 : daily, study, tech, hobby, exercise',
    required: true
  })
  @ApiOperation({ summary: 'Get single category' })
  @Get(':label')
  @HttpCode(HttpStatus.OK)
  findByLabel(@Param('label') label) {
    return this.categoryService.findByLabel(label);
  }

  /**
   * edit single categories
   */
  @ApiExcludeEndpoint()
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  editById(@Param('id') id: string, @Body() category: Partial<Category>) {
    return this.categoryService.editById(id, category);
  }

  /**
   * delete single categories
   */
  @ApiExcludeEndpoint()
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  deleteById(@Param('id') id: string) {
    return this.categoryService.deleteById(id);
  }
}
