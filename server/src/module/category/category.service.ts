import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Category } from "./category.entity";
import { Repository } from "typeorm";

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: Repository<Category>) {}
  /**
   * create a new category
   */
  async create(category: Partial<Category>) {
    return {
      msg: "create a new category",
    };
  }
}
