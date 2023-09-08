import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { CommentService, CommentType } from './comment.service';
import { JwtGuard } from '../auth/guard/access-jwt.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';
import { Role } from '../auth/role.enum';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.VISITOR)
  @HttpCode(HttpStatus.CREATED)
  @Post(':id')
  create(
    @Param('id') articleId: string,
    @Req() req,
    @Body() commentBody: CommentType
  ) {
    const userId = req.userInfo.id as string;
    return this.commentService.create(userId, articleId, commentBody);
  }

  /**
   * 댓글 번호에 대한 댓글
   * @param id
   * @returns
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') commentId: string) {
    return this.commentService.findComment(commentId);
  }

  /**
   * article 번호에 관한 댓글
   * @returns
   */
  @Get('article/:id')
  @HttpCode(HttpStatus.OK)
  findAll(@Param('id') id: string) {
    return this.commentService.findArticleComments(id);
  }

  /**
   * 댓글 수정
   * 작성자만 수정 가능
   * @param id
   * @param updateCommentDto
   * @returns
   */
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.VISITOR)
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() req,
    @Body() updateCommentDto: { content: string }
  ) {
    const userId = req.userInfo.id as string;
    return this.commentService.update(id, userId, updateCommentDto);
  }

  /**
   * 댓글 삭제
   * 작성자만 삭제 가능
   * @param id
   * @returns
   */
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.VISITOR)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    const userId = req.userInfo.id as string;
    return this.commentService.remove(id, userId);
  }
}
