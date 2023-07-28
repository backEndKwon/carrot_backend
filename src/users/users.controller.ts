import {
  Controller,
  Post,
  Get,
  Req,
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
      // console.log('controller/email====', kakao.kakao_account.email);
      // const isEmailAndUserId = await this.usersService.findEmailAndUserId(
      //   kakao.kakao_account.email,
      // );

      const kakao_info = JSON.parse(JSON.stringify(kakao));
    const email = kakao_info.kakao_account.email; //카카오 이메일
      
      // //user정보 저장 후 user_id 반환
      await this.usersService.saveUserInfo(kakao_info);

      ///자체 accessToken 발급
      const accessToken = await this.usersService.accessToken(email);
      res.send({
        accessToken,
      });
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('로그인 실패');
    }
  }

  // @Get('/user')
  // async user(@Req() req): Promise<any> {
  //   const {authorization } = req.headers;
  //   const result = this.usersService.validateAccessToken(authorization,req.user['email']);
  //   return result;
    // const accessToken = request.headers.Authorization.replace('Bearer ', '');
    // const { userId } = body;
    // console.log('controller/userId', userId);
    // const checkInfo = { accessToken, userId };
    // return await this.usersService.getUserInfo(checkInfo);
  // }
}
