import { ApiProperty } from '@nestjs/swagger';

export namespace ArticleDTO {
  export namespace Request {
    export class createArticleDto {
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
  }
}
