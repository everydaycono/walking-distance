import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity()
export class Search {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string;

  @Column()
  keyword: string;

  @Column({ default: 1 })
  count: number;

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
