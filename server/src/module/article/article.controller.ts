import { ArticleService } from './article.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Article } from './article.entity';
import { JwtGuard } from '../auth/guard/access-jwt.guard';

@ApiTags('🌳Article')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
  /**
   * create article
   */
  @ApiResponse({ status: 201, description: 'Create Article', type: [Article] })
  @ApiOperation({ summary: 'Create Article' })
  @Post()
  // @UseGuards(JwtGuard)
  create(@Body() article) {
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
  @Get(':id')
  getSingleArticle(@Param('id') id: string) {
    return this.articleService.getSingleArticle(id);
  }

  /**
   * edit single article
   */
  @ApiResponse({
    status: 200,
    description: 'Edit Single Article',
    type: [Article]
  })
  @ApiOperation({ summary: 'Edit Single Article' })
  @Patch(':id')
  editSingleArticle(
    @Param('id') id: string,
    @Body() article: Partial<Article>
  ) {
    return this.articleService.editSingleArticle(id, article);
  }

  /**
   * delete single article
   */
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
