import { Injectable } from '@nestjs/common';
//추후 삭제
@Injectable()
export class AppService {
  getHello(): { message: string } {
    return { message: 'Hello World!' };
  }
}
