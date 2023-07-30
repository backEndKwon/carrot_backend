import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UsersEntity } from '../users/users.entity';

@Entity('Posts')
export class PostsEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  post_id: number;

  @Column({ nullable: true })
  user_id: number;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', array: true, default: [], nullable: true })
  photo_ip: string[];

  @Column()
  min_price: number;

  @Column({ type: 'text', nullable: true })
  biz_count: number;

  @Column({ type: 'int', nullable: true })
  biz_price: number;

  @Column()
  dueToDate: string;

  @Column({ default: 'false' })
  is_sold: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UsersEntity, (user) => user.posts)
  @JoinColumn({ name: 'user_id' })
  users: UsersEntity;
}
