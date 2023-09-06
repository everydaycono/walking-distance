import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
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
  @ApiResponse({
    status: 200,
    description: "create a new category",
    type: [Category],
  })
  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  create(@Body() category: Partial<Category>) {
    return this.categoryService.create(category);
  }
}
