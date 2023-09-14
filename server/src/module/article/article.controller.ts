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
  ApiQuery,
  ApiTags
} from '@nestjs/swagger';
import { Article } from './article.entity';
import { JwtGuard } from '../auth/guard/access-jwt.guard';
import { InputArticleType } from './types/article.type';
import { ArticleDTO } from './dto/article.dto';

@ApiTags('Article')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
  /**
   * create article
   */
  @ApiOperation({ summary: 'Create Article' })
  @ApiBody({
    type: ArticleDTO.Request.CreateArticleDto,
    description:
      '게시물 status : draft, publish, onlyme </br> 게시물 category : daily, study, tech, hobby, exercise'
  })
  @ApiBearerAuth()
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

  @ApiOperation({ summary: 'Get All Articles' })
  @ApiQuery({
    name: 'status',
    required: false
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  getAllArticles(@Query('status') status: ArticleDTO.Request.StatusQueryDto) {
    return this.articleService.getAllArticles(status);
  }

  /**
   * get single article
   */
  @ApiOperation({ summary: 'Get Single Article' })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getSingleArticle(@Param('id') id: string) {
    return this.articleService.getSingleArticle(id);
  }

  /**
   * edit single article
   */
  @ApiOperation({ summary: 'Edit Single Article' })
  @ApiBearerAuth()
  @ApiBody({
    type: ArticleDTO.Request.EditArticleDto,
    description:
      '게시물 status : draft, publish, onlyme </br> 게시물 category : daily, study, tech, hobby, exercise'
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
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
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete Single Article' })
  @Delete(':id')
  deleteSingleArticle(@Param('id') id: string, @Req() req) {
    const userId = req.userInfo.id as string;
    return this.articleService.deleteSingleArticle(id, userId);
  }
}
