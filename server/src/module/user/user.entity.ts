import { Article } from 'src/module/article/article.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsEmail, MinLength } from 'class-validator';
import { Comment } from '../comment/comment.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  @MinLength(3, {
    message: 'firstName must be at least 3 characters'
  })
  firstName: string;

  @Column({ length: 100 })
  @MinLength(3, {
    message: 'lastName must be at least 3 characters'
  })
  lastName: string;

  @Exclude()
  @Column({ length: 500 })
  password: string;

  @Column({ length: 500, default: null })
  avatar: string;

  @Column({ length: 500, nullable: null })
  @IsEmail()
  @MinLength(5, {
    message: 'email must be at least 5 characters'
  })
  email: string;

  @Column('simple-enum', { enum: ['admin', 'visitor'], default: 'visitor' })
  role: string;

  @Column('simple-enum', { enum: ['locked', 'active'], default: 'active' })
  status: string;

  @Column({ default: 'normal' })
  type: string;

  @Exclude()
  @Column({ length: 500, default: null })
  refreshToken: string;

  @Column({ type: 'boolean', default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true })
  emailVerificationToken: string;

  @Column({ nullable: true })
  emailVerificationExpiry: Date;

  @CreateDateColumn({
    type: 'datetime',
    comment: 'Creation time',
    name: 'create_at'
  })
  createAt: Date;

  @UpdateDateColumn({
    type: 'datetime',
    comment: 'Update time',
    name: 'update_at'
  })
  updateAt: Date;

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Article, (article) => article.user)
  articles: Article[];
}
