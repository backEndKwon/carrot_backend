import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsEntity } from './posts.entity';
import { PostsRepository } from './posts.repository';
import { UsersModule } from 'src/users/users.module';
import { UsersRepository } from 'src/users/users.repository';
import { BizsModule } from 'src/bizs/bizs.module';
import { BizsRepository } from 'src/bizs/bizs.repository';
import { EventEmitter } from 'events';
@Module({
  imports: [
    TypeOrmModule.forFeature([PostsEntity, PostsRepository]),
    UsersModule,
    BizsModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository, UsersRepository, BizsRepository],
})
export class PostsModule {}
