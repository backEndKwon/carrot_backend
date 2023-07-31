import { Module } from '@nestjs/common';
import { BizsEntity } from './bizs.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BizsRepository } from './bizs.repository';

@Module({ 
    imports: [TypeOrmModule.forFeature([BizsEntity])],
    // controllers: [BizsController],
    providers: [BizsRepository]
    })
export class BizsModule {}
