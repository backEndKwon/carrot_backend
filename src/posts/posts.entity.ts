import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { UsersEntity } from '../users/users.entity';
import { BizsEntity } from 'src/bizs/bizs.entity';

@Entity('Posts')
export class PostsEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  post_id: number;

  @Column({ nullable: true, name: 'user_id' })
  user_id: number;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', array: true, default: [], nullable: true })
  photo_ip: string[];

  @Column({ default: 0 })
  min_price: number;

  @Column({ type: 'int', default: 0 })
  biz_count: number;

  @Column({ type: 'int', default: 0 })
  biz_price: number;

  @Column()
  dueToDate: string;

  @Column({ default: 'false' })
  is_sold: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UsersEntity)
  @JoinColumn({ name: 'user_id' })
  users: UsersEntity;

  @ManyToMany(() => PostsEntity)
  @JoinColumn({ name: 'biz_id' })
  bizs: BizsEntity;
}
