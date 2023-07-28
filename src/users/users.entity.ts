import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { PostsEntity } from '../posts/posts.entity';

@Entity('Users')
export class UsersEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({nullable:true})
  email: string;

  @Column()
  nickname: string;

  @Column({ type: 'text' })
  profile: string;

  @Column({ type: 'text', array: true, default: [] })
  post_items: number[]; // 자기 post_id를 저장할 배열 필드

  @Column({ type: 'text', array: true, default: [] })
  biz_items: number[]; // 남의 post_id를 저장할 배열 필드

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => PostsEntity, (posts) => posts.users)
  posts: PostsEntity[];
}
