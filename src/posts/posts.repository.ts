import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { PostsEntity } from './posts.entity';
// import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class PostsRepository extends Repository<PostsEntity> {
  constructor(private dataSource: DataSource) {
    super(PostsEntity, dataSource.createEntityManager());
  }
}