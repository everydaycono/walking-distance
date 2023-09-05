import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Article {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column({ type: "text", default: null })
  summary: string;

  @ApiProperty()
  @Column({ type: "mediumtext", default: null, charset: "utf8mb4" })
  content: string;

  @ApiProperty()
  @Column({ type: "mediumtext", default: null })
  toc: string;

  @ApiProperty()
  @Column("simple-enum", { enum: ["draft", "publish"] })
  status: string;

  @ApiProperty()
  @Column({ type: "int", default: 0 })
  views: number;

  @ApiProperty()
  @Column({ type: "int", default: 0 })
  likes: number;

  @ApiProperty()
  @Column({ type: "boolean", default: false })
  isRecommended: boolean;

  @ApiProperty()
  @Column({ type: "boolean", default: true })
  isCommentable: boolean;

  @ApiProperty()
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  publishAt: Date;

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
    comment: "更新时间",
    name: "update_at",
  })
  updateAt: Date;
}
