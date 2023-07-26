import {
  Controller,
  Post,
  Body,
  Response,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/login') // 카카오 인가코드 회신
  async login(@Body() body: any, @Response() res: any): Promise<any> {
    try {
      // const { code, domain } = body;
      const { code } = body;
      if (!code) {
        throw new BadRequestException('카카오 정보가 없습니다');
      }
      //
      // const kakao = await this.usersService.kakaoLogin({ code, domain });
      const kakao = await this.usersService.kakaoLogin({ code });

      console.log(`kakaoUserInfo : ${JSON.stringify(kakao)}`);
      if (!kakao.id) {
        throw new BadRequestException('해당 카카오 계정이 없습니다');
      }
      res.send({
        user: kakao,
        message: 'success',
      });
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException('로그인 실패');
    }
  }
}
