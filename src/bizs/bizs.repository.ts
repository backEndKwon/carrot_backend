import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { BizsEntity } from './bizs.entity';

@Injectable()
export class BizsRepository extends Repository<BizsEntity> {
  constructor(private dataSource: DataSource) {
    super(BizsEntity, dataSource.createEntityManager());
  }

  async getAllBizPost(post_id: number) {
    const bizInfo = await this.find({
      where: { post_id },
      order: { createdAt: 'ASC' },
    });
    console.log('===========> ~ bizInfo:', bizInfo);

    return bizInfo;
  }
}
