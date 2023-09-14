import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinTable
} from 'typeorm';
import { Comment } from '../comment/comment.entity';
import { Category } from '../category/category.entity';
import { Tag } from '../tag/tag.entity';
import { User } from '../user/user.entity';

@Entity()
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'mediumtext', default: null, charset: 'utf8mb4' })
  content: string;

  @Column({ type: 'varchar', nullable: true })
  thumbnail: string;

  @Column('simple-enum', {
    enum: ['draft', 'publish', 'onlyme'],
    default: 'draft'
  })
  status: string;

  @Column({ type: 'int', default: 0 })
  views: number;

  @Column({ type: 'int', default: 0 })
  likes: number;

  @ManyToOne(() => Category, (category) => category.articles)
  @JoinTable()
  category: Category;

  @ManyToMany(() => Tag, (tag) => tag.articles)
  @JoinTable()
  tags: Tag[];

  @Column({ type: 'boolean', default: false })
  isRecommended: boolean;

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

  @OneToMany(() => Comment, (comment) => comment.article)
  comments: Comment[];

  @ManyToOne(() => User, (user) => user.articles)
  user: User;
}
