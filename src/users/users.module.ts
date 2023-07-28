import { Module } from '@nestjs/common';
import { UsersController } from '../users/users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { JwtModule } from '@nestjs/jwt';
import { UsersEntity } from './users.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    JwtModule.register({ secret: "secret",
    signOptions:{expiresIn:"60000000s"}}),
    TypeOrmModule.forFeature([UsersRepository, UsersEntity]),
    PassportModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports:[UsersService, JwtModule],
})
export class UsersModule {}
