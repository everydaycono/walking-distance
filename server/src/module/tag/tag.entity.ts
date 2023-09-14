import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Article } from '../article/article.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  label: string;

  @ApiProperty()
  @ManyToMany(() => Article, (article) => article.tags)
  @JoinTable()
  articles: Article[];

  @ApiProperty()
  @CreateDateColumn({
    type: 'datetime',
    comment: 'create time',
    name: 'create_at'
  })
  createAt: Date;

  @ApiProperty()
  @UpdateDateColumn({
    type: 'datetime',
    comment: 'update time',
    name: 'update_at'
  })
  updateAt: Date;
}
