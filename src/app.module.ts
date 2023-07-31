import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsController } from './posts/posts.controller';
import { PostsService } from './posts/posts.service';
import { PostsModule } from './posts/posts.module';
import { typeORMConfig } from './configs/typeorm.config';
import { UsersRepository } from './users/users.repository';
import { PostsRepository } from './posts/posts.repository';
import { BizsModule } from './bizs/bizs.module';
import { BizsRepository } from './bizs/bizs.repository';
import { BizModule } from './biz/biz.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    UsersModule,
    PostsModule,
    BizsModule,
    BizModule,
  ],
  controllers: [AppController, UsersController, PostsController],
  providers: [
    AppService,
    UsersService,
    PostsService,
    UsersRepository,
    PostsRepository,
    BizsRepository,
  ],
})
export class AppModule {}