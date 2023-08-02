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
import { PostsEntity } from 'src/posts/posts.entity';

@Entity('Bizs')
export class BizsEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  biz_id: number;

  @Column({ nullable:true, name: 'user_id' })
  user_id: number;//입찰을 하는사람

  @Column({ nullable:true, name: 'post_id' })
  post_id: number;

  @Column({ type: 'int', nullable: true, default: 0})
  biz_price: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UsersEntity)
  @JoinColumn({ name: 'user_id' })
  users: UsersEntity;

  @ManyToMany(() => PostsEntity)
  @JoinColumn({ name: 'post_id' })
  posts: PostsEntity;
}
