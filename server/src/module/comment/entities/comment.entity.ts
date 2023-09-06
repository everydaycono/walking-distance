import { Article } from 'src/module/article/article.entity';
import { User } from 'src/module/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column()
  content: string;

  //   Date
  @CreateDateColumn({
    type: 'datetime',
    comment: 'create time',
    name: 'create_at',
  })
  createAt: Date;

  @UpdateDateColumn({
    type: 'datetime',
    comment: 'update time',
    name: 'update_at',
  })
  updateAt: Date;

  //   comment pass
  @Column({ type: 'boolean', default: true })
  pass: boolean;

  //   Type orm one to one (https://orkhan.gitbook.io/typeorm/docs/one-to-one-relations)
  @ManyToOne(() => User, (user) => user.comments) // 유저가 없을경우 anonymouse 로 할지.
  user: User;

  @ManyToOne(() => Article, (article) => article.comments)
  article: Article;

  //   typeorm self relationship (https://orkhan.gitbook.io/typeorm/docs/relations-faq)
  @ManyToOne(() => Comment, (comment) => comment.children, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  parent: Comment;

  //   typeorm self relationship (https://orkhan.gitbook.io/typeorm/docs/relations-faq)
  @OneToMany(() => Comment, (comment) => comment.parent, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  children: Comment[];

  //   🚧 추가 작업 댓글 좋아요 기능.
}
