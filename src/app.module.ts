import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsController } from './Posts/Posts.controller';
import { PostsService } from './posts/posts.service';
import { PostsModule } from './posts/posts.module';
import { typeORMConfig } from './configs/typeorm.config';
import { UsersRepository } from './users/users.repository';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    UsersModule,
    PostsModule,
    PostsModule,
    JwtModule.register({}),
  ],
  controllers: [AppController, UsersController, PostsController],
  providers: [AppService, UsersService, PostsService, UsersRepository],
})
export class AppModule {}
