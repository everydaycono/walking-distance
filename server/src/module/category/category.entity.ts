import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Article } from "../article/article.entity";

@Entity()
export class Category {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty()
  @Column()
  label: string;

  @ApiProperty()
  @Column()
  value: string;

  @ApiProperty()
  @OneToMany(() => Article, (article) => article)
  articles: Array<Article>;

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
