import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';

export namespace CommentDTO {
  export namespace Request {
    export class CreateCommentDto {
      @ApiProperty({
        example: 'comment content',
        description: '댓글 내용',
        required: true
      })
      content: string;
    }
    export class EditCommentDto {
      @ApiProperty({
        example: 'comment content',
        description: '댓글 내용',
        required: true
      })
      @IsOptional()
      content: string;
    }
  }
}
