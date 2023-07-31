import { Module } from '@nestjs/common';
import { BizGateway } from './biz.gateway';
import { PostsService } from 'src/posts/posts.service';
import { PostsRepository } from 'src/posts/posts.repository';
import { UsersRepository } from 'src/users/users.repository';
import { BizsRepository } from 'src/bizs/bizs.repository';

@Module({
  providers: [
    BizGateway,
    PostsService,
    PostsRepository,
    UsersRepository,
    BizsRepository,
  ],
})
export class BizModule {}