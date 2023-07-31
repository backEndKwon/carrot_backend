import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as http from 'http';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 5000;
  // CORS 설정
  app.enableCors({
    origin: '*',
    credentials: true,
  }),
    await app.listen(port);
}
bootstrap();
