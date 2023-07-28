import { Module } from '@nestjs/common';
import { UsersController } from '../users/users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { JwtModule } from '@nestjs/jwt';
import { UsersEntity } from './users.entity';
@Module({
  imports: [
    JwtModule.register({ secret: "secret",
    signOptions:{expiresIn:"6000s"}}),
    TypeOrmModule.forFeature([UsersRepository, UsersEntity]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports:[UsersService, JwtModule],
})
export class UsersModule {}
