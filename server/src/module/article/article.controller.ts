import { ArticleService } from './article.service';
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
import { Article } from './article.entity';
import { JwtGuard } from '../auth/guard/access-jwt.guard';
import { CustomArticleType } from './types/article.type';

@ApiTags('🌳Article')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
  /**
   * create article
   */
  @ApiResponse({ status: 201, description: 'Create Article', type: [Article] })
  @ApiOperation({ summary: 'Create Article' })
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtGuard)
  @Post()
  create(@Body() article: CustomArticleType) {
    return this.articleService.create(article);
  }

  /**
   * get all articles
   */
  @ApiResponse({
    status: 200,
    description: 'Get All Articles',
    type: [Article]
  })
  @ApiOperation({ summary: 'Get All Articles' })
  @HttpCode(HttpStatus.OK)
  @Get()
  getAllArticles() {
    return this.articleService.getAllArticles();
  }

  /**
   * get single article
   */
  @ApiResponse({
    status: 200,
    description: 'Get Single Article',
    type: [Article]
  })
  @ApiOperation({ summary: 'Get Single Article' })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getSingleArticle(@Param('id') id: string) {
    return this.articleService.getSingleArticle(id);
  }

  /**
   * edit single article
   */
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  @ApiResponse({
    status: 200,
    description: 'Edit Single Article',
    type: [Article]
  })
  @ApiOperation({ summary: 'Edit Single Article' })
  @Patch(':id')
  editSingleArticle(
    @Param('id') id: string,
    @Body() article: CustomArticleType
  ) {
    return this.articleService.editSingleArticle(id, article);
  }

  /**
   * delete single article
   */
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'Delete Single Article',
    type: [Article]
  })
  @ApiOperation({ summary: 'Delete Single Article' })
  @Delete(':id')
  deleteSingleArticle(@Param('id') id: string) {
    return this.articleService.deleteSingleArticle(id);
  }
}
