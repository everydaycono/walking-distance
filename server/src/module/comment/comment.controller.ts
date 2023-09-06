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
  @Post(':id')
  create(
    @Param('id') articleId: string,
    @Req() req,
    @Body() commentBody: CommentType
  ) {
    const userId = req.userInfo.id as string;
    return this.commentService.create(userId, articleId, commentBody);
  }

  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto) {
    return this.commentService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
