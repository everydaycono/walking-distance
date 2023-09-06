import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Category } from "../category/category.entity";

@Entity()
export class Article {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column({ type: "mediumtext", default: null, charset: "utf8mb4" })
  content: string;

  @ApiProperty()
  @Column("simple-enum", { enum: ["draft", "publish"], default: "draft" })
  status: string;

  @ApiProperty()
  @Column({ type: "int", default: 0 })
  views: number;

  @ApiProperty()
  @Column({ type: "int", default: 0 })
  likes: number;

  @ApiProperty()
  @ManyToOne(() => Category, (category) => category.articles, { cascade: true })
  @JoinTable()
  category: Category;

  @ApiProperty()
  @Column({ type: "boolean", default: false })
  isRecommended: boolean;

  @ApiProperty()
  @Column({ type: "boolean", default: true })
  isCommentable: boolean;

  @ApiProperty()
  @CreateDateColumn({
    type: "datetime",
    comment: "create time",
    name: "create_at",
  })
  createAt: Date;

  @ApiProperty()
  @UpdateDateColumn({
    type: "datetime",
    comment: "update time",
    name: "update_at",
  })
  updateAt: Date;
}
