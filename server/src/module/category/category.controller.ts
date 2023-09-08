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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @ApiResponse({
    status: 201,
    description: 'create a new category'
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  create(@Body() category: Partial<Category>) {
    return this.categoryService.create(category);
  }

  /**
   * get all categories
   */
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'get all categories'
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.categoryService.findAll();
  }

  /**
   * get single categories
   */
  @ApiOperation({ summary: 'Get single category' })
  @ApiResponse({
    status: 200,
    description: 'get single category'
  })
  @Get(':label')
  @HttpCode(HttpStatus.OK)
  findByLabel(@Param('label') label: string) {
    return this.categoryService.findByLabel(label);
  }

  /**
   * edit single categories
   */
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @ApiOperation({ summary: 'Edit single category' })
  @ApiResponse({
    status: 200,
    description: 'edit single category'
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  editById(@Param('id') id: string, @Body() category: Partial<Category>) {
    return this.categoryService.editById(id, category);
  }

  /**
   * edit single categories
   */
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @ApiOperation({ summary: 'Delete single category' })
  @ApiResponse({
    status: 200,
    description: 'delete single category'
  })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  deleteById(@Param('id') id: string) {
    return this.categoryService.deleteById(id);
  }
}
