import { Module } from '@nestjs/common';
import { UsersController } from '../users/users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { JwtModule } from '@nestjs/jwt';
import { UsersEntity } from './users.entity';
@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([UsersRepository, UsersEntity])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
