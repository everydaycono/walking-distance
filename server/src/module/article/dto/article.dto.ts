import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';

export namespace ArticleDTO {
  export namespace Request {
    export class CreateArticleDto {
      @ApiProperty({
        example: 'article title',
        description: '게시글 제목',
        required: true
      })
      title: string;

      @ApiProperty({
        example: 'article content',
        description: '게시글 내용',
        required: true
      })
      content: string;

      @ApiProperty({
        example: 'publish',
        description: '게시글 상태',
        type: 'draft, publish, onlyme',
        required: true
      })
      status: string;

      @ApiProperty({
        example: 'daily',
        description: '게시글 상태',
        type: 'daily, study, tech, hobby, exercise',
        required: true
      })
      category: string;
    }
    export class StatusQueryDto {
      @ApiProperty({
        description: 'Status of the resource "draft", "publish", "onlyme"',
        required: false,
        enum: ['draft', 'publish', 'onlyme', null],
        default: null
      })
      @IsOptional()
      @IsIn(['draft', 'publish', 'onlyme', null])
      status: string | null;
    }
  }
}
