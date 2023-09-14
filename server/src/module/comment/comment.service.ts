import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';

export type CommentType = Partial<Comment> & {
  content: string;
  parent?: string;
};

const userInfo = {
  email: true,
  firstName: true,
  lastName: true,
  avatar: true
};
const childParentInfo = {
  content: true,
  updateAt: true,
  createAt: true,
  id: true,
  user: userInfo
};
// -----------------------------------------------
@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>
  ) {}

  // create comment
  async create(userId: string, articleId: string, commentBody: CommentType) {
    if (!userId || !articleId || !commentBody) {
      throw new BadRequestException(
        'please provide user id, article id and comment body'
      );
    }
    if (!commentBody.content) {
      throw new BadRequestException('please provide omment body');
    }

    const { parent, content } = commentBody;

    const newComment = this.commentRepository.create({
      content,
      user: { id: userId },
      article: { id: articleId },
      // Only  parent id exist (대댓글)
      ...(parent ? { parent: { id: parent } } : {})
    });

    try {
      await this.commentRepository.save(newComment);
      return {
        message: 'Comment created successfully',
        content: newComment.content
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  // find comment is not had parent
  async findArticleComments(id: string) {
    const comments = await this.commentRepository.find({
      where: {
        article: { id },
        parent: IsNull()
      },
      select: {
        user: userInfo,
        children: {
          content: true,
          updateAt: true,
          createAt: true,
          id: true,
          user: userInfo
        }
      },
      relations: {
        user: true,
        children: {
          user: true
        }
      }
    });
    return comments;
  }

  // find all comments
  async findComment(id: string) {
    const comments = await this.commentRepository.findOne({
      where: {
        id
      },
      select: {
        user: userInfo,
        children: childParentInfo,
        parent: childParentInfo
      },
      relations: {
        user: true,
        children: {
          user: true
        },
        parent: {
          user: true
        }
      }
    });
    return comments;
  }

  // update comment
  async update(
    id: string,
    userId: string,
    updateCommentDto: { content: string }
  ) {
    if (!updateCommentDto.content) {
      throw new BadRequestException('please provide comment body');
    }

    const oldComment = await this.commentRepository.findOne({
      where: {
        id,
        user: { id: userId }
      },
      select: {
        user: {
          id: true
        }
      },
      relations: {
        user: true
      }
    });

    // 유저가 댓글의 작성자 인지 확인
    // user owner is not allowed to update
    if (oldComment.user.id !== userId) {
      throw new ForbiddenException(
        'You are not allowed to update this comment'
      );
    }

    try {
      await this.commentRepository
        .createQueryBuilder()
        .update()
        .set({ content: updateCommentDto.content })
        .where('id = :id', { id })
        .execute();

      return {
        message: 'Comment updated successfully'
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  // delete comment
  async remove(id: string, userId: string) {
    const findComment = await this.commentRepository.findOne({
      where: {
        id,
        user: { id: userId }
      },
      select: {
        user: {
          id: true
        }
      },
      relations: {
        user: true
      }
    });

    if (!findComment) {
      throw new NotFoundException('Comment not found');
    }

    if (findComment.user.id !== userId) {
      throw new ForbiddenException(
        'You are not allowed to delete this comment'
      );
    }

    try {
      await this.commentRepository.delete({ id });

      return {
        message: 'Comment deleted successfully'
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
