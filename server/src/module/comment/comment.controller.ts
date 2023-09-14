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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { CommentDTO } from './dto/comment.dto';

@ApiTags('Comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  /**
   * create comment
   */
  @ApiBearerAuth()
  @ApiBody({
    type: CommentDTO.Request.CreateCommentDto
  })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.VISITOR)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create Comment' })
  @Post(':articleId')
  create(
    @Param('articleId') articleId: string,
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

  @ApiOperation({ summary: 'Find Comment by id' })
  @Get(':commentId')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('commentId') commentId: string) {
    return this.commentService.findComment(commentId);
  }

  /**
   * article 번호에 관한 댓글
   * @returns
   */
  @ApiOperation({ summary: 'Find all comments by article' })
  @ApiResponse({
    status: 200,
    description: 'Find all comments by article'
  })
  @Get('article/:articleId')
  @HttpCode(HttpStatus.OK)
  findAll(@Param('articleId') id: string) {
    return this.commentService.findArticleComments(id);
  }

  /**
   * 댓글 수정
   * 작성자만 수정 가능
   * @param id
   * @param updateCommentDto
   * @returns
   */
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Comment' })
  @ApiBody({
    type: CommentDTO.Request.EditCommentDto
  })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.VISITOR)
  @HttpCode(HttpStatus.OK)
  @Patch(':commentId')
  update(
    @Param('commentId') id: string,
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
  @ApiOperation({ summary: 'Delete Comment' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.VISITOR)
  @HttpCode(HttpStatus.OK)
  @Delete(':commentId')
  remove(@Param('commentId') id: string, @Req() req) {
    const userId = req.userInfo.id as string;
    return this.commentService.remove(id, userId);
  }
}
