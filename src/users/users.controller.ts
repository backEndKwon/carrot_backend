import {
  Controller,
  Post,
  Get,
  Body,
  Response,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class UsersController {
  constructor(private usersService: UsersService) {}

  //카카오 로그인
  @Post('/login') // 카카오 인가코드 회신
  async login(@Body() body: any, @Response() res: any): Promise<any> {
    try {
      // const { authCode, domain } = body;
      const { authCode } = body;
      console.log(`controller/authCode = ${authCode}`);
      console.log('-------------------------');
      console.log(`controller/body = ${body}`);
      console.log('-------------------------');

      //---카카오톡 로그인 과정 중 에러 발생시---//
      if (!authCode) {
        throw new BadRequestException('카카오 정보가 없습니다');
      }
      //
      // const kakao = await this.usersService.kakaoLogin({ authCode, domain });
      const kakao = await this.usersService.kakaoLogin({ authCode });

      console.log(`controller/kakaoUserInfo : ${JSON.stringify(kakao)}`);
      if (!kakao.id) {
        throw new BadRequestException('해당 카카오 계정이 없습니다');
      }
      //-------------------------------------------//

      //---카카오 인증 완료후 사용자 정보 저장
      console.log("controller/email====", kakao.kakao_account.email)       
      const isEmailAndUserId = await this.usersService.findEmailAndUserId(
        kakao.kakao_account.email,
      );

      if (!isEmailAndUserId) {
        console.log('기 가입 사용자');
      } else {
        await this.usersService.saveUserInfo(kakao);
        console.log('controller/사용자 정보 저장완료');
      }

      ///자체 accessToken 발급
      const accessToken = await this.usersService.accessToken(kakao);
      res.send({
        accessToken,
        message: 'success',
      });
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('로그인 실패');
    }
  }
  // @Get('/user')
  // async user(){
  //   return "유저정보"
  // }
}
