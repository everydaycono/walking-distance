import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull,  Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';

export type CommentType = Partial<Comment> & {
  content: string;
  parent?: string;
};

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}
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
      ...(parent ? { parent: { id: parent } } : {}),
    });

    try{
      await this.commentRepository.save(newComment);
      return {
        message: 'Comment created successfully',
        content: newComment.content,
      };
    }catch(error){
      throw new BadRequestException(error)
    }

  }

  async findAll() {
    const comment = await this.commentRepository.find({
      where: {
        article: {
          id: 'bb8dbcfb-0429-4265-a7da-75b5cdff676b',
        },
        parent: IsNull(),
      },
      relations: {
        children: true,
      },
    });

    console.log(comment);
    return comment;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
