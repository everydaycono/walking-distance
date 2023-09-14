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
  Query,
  Req,
  UseGuards
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { Article } from './article.entity';
import { JwtGuard } from '../auth/guard/access-jwt.guard';
import { InputArticleType } from './types/article.type';
import { ArticleDTO } from './dto/article.dto';

@ApiTags('🌳Article')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
  /**
   * create article
   */
  @ApiOperation({ summary: 'Create Article' })
  @ApiBody({
    type: ArticleDTO.Request.createArticleDto
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'successfully created article',
    type: [Article]
  })
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtGuard)
  @Post()
  create(@Body() article: InputArticleType, @Req() req) {
    const userId = req.userInfo.id as string;
    return this.articleService.create(article, userId);
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
  getAllArticles(@Query('status') status) {
    return this.articleService.getAllArticles(status);
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
    @Body() article: InputArticleType,
    @Req() req
  ) {
    const userId = req.userInfo.id as string;
    return this.articleService.editSingleArticle(id, article, userId);
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
  deleteSingleArticle(@Param('id') id: string, @Req() req) {
    const userId = req.userInfo.id as string;
    return this.articleService.deleteSingleArticle(id, userId);
  }
}
