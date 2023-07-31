import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  // username: 'carrots',//서버 db
  username: 'postgres',// 로컬 db
  password: '5432',
  // database: 'carrots', //서버 db
  database: 'carrot_server', //로컬 db
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};
