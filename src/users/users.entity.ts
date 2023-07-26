import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { PostsEntity } from '../posts/posts.entity';

@Entity('Users')
export class UsersEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  email: string;

  @Column()
  nickname: string;

  @Column({ type: 'text' })
  profile: string;

  @Column({ type: 'text', nullable: true })
  post_items: string;

  @Column({ type: 'text', nullable: true })
  biz_items: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => PostsEntity, (posts) => posts.users)
  posts: PostsEntity[];
}
