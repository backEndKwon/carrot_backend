import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsEntity } from './posts.entity';
import { PostsRepository } from './posts.repository';
import { UsersModule } from 'src/users/users.module';
import { UsersRepository } from 'src/users/users.repository';
@Module({
  imports: [TypeOrmModule.forFeature([PostsEntity,PostsRepository]), UsersModule],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository,UsersRepository],
})
export class PostsModule {}
