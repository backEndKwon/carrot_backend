import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { BizsEntity } from './bizs.entity';

@Injectable()
export class BizsRepository extends Repository<BizsEntity> {
  constructor(private dataSource: DataSource) {
    super(BizsEntity, dataSource.createEntityManager());
  }
}
