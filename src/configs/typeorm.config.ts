import { TypeOrmModuleOptions } from "@nestjs/typeorm"

export const typeORMConfig : TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '5432',
    database: 'carrot_server',
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize : true
}