import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Article } from '../article/article.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  label: string;

  @OneToMany(() => Article, (article) => article.category)
  articles: Article[];

  @CreateDateColumn({
    type: 'datetime',
    comment: 'create time',
    name: 'create_at'
  })
  createAt: Date;

  @UpdateDateColumn({
    type: 'datetime',
    comment: 'update time',
    name: 'update_at'
  })
  updateAt: Date;
}
