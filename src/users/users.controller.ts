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

      //---카카오톡 로그인 과정 중 에러 발생시---//
      if (!authCode) {
        throw new BadRequestException('카카오 정보가 없습니다');
      }
      //
      // const kakao = await this.usersService.kakaoLogin({ authCode, domain });
      // 받은 인가코드로 가져온 유저정보
      const kakaoUserInfo = await this.usersService.kakaoLogin({ authCode });

      //
      if (!kakaoUserInfo.id) {
        throw new BadRequestException('해당 카카오 계정이 없습니다');
      }
      //-------------------------------------------//

      //---카카오 인증 완료후 사용자 정보 저장
      //
      // const isEmailAndUserId = await this.usersService.findEmailAndUserId(
      //   kakao.kakao_account.email,
      // );

      const email = kakaoUserInfo.kakao_account.email; //카카오 이메일

      ///자체 accessToken 발급
      const accessToken = await this.usersService.accessToken(email);

      res.send({
        accessToken,
      });
    } catch (error) {
      throw new UnauthorizedException('로그인 실패');
    }
  }

  @Get('/user')
  async user(@Req() req): Promise<any> {
    const { authorization } = req.headers;
    const token = authorization.split(' ')[1];

    const result = await this.usersService.verifyTokenAndUserInfo(token);

    return result;
    // const accessToken = request.headers.Authorization.replace('Bearer ', '');
    // const { userId } = body;
    //
    // const checkInfo = { accessToken, userId };
    // return await this.usersService.getUserInfo(checkInfo);
  }
  // @Get('/dummpyData')
  // async dummpyData(
  //   user_id: number,
  //   email: string,
  //   nickname: string,
  //   profile: string,
  // ) {
  //   return await this.usersService.dummyData(user_id, email, nickname, profile);
  // }
}
