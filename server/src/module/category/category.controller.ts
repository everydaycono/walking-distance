import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Category } from "./category.entity";
import { Roles } from "../auth/decorators/roles.decorators";
import { JwtGuard } from "../auth/guard/access-jwt.guard";
import { RolesGuard } from "../auth/guard/roles.guard";
import { Role } from "../auth/role.enum";
import { CategoryService } from "./category.service";

@ApiTags("Category")
@Controller("category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  /**
   * create a new category
   */
  @ApiOperation({ summary: "Create category" })
  @ApiResponse({
    status: 201,
    description: "create a new category",
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
  @ApiOperation({ summary: "Get all categories" })
  @ApiResponse({
    status: 200,
    description: "get all categories",
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Query() queryParams) {
    return this.categoryService.findAll(queryParams);
  }

  /**
   * get single categories
   */
  @ApiOperation({ summary: "Get single category" })
  @ApiResponse({
    status: 200,
    description: "get single category",
  })
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  findById(@Param("id") id: string) {
    return this.categoryService.findById(id);
  }
}
