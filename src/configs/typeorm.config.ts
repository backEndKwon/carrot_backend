import { TypeOrmModuleOptions } from "@nestjs/typeorm"

export const typeORMConfig : TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'carrots',
    password: '5432',
    database: 'carrots',
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize : true
}
