import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import * as qs from 'qs';
import { UsersEntity } from './users.entity';
import { UsersRepository } from './users.repository';
import { JwtService } from '@nestjs/jwt/dist';
// import { access } from 'fs';
// import { KakaoLoginAuthOutputDto } from 'src/common/dtos/kakao-login-auth.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async kakaoLogin(options: { authCode: string }): Promise<any> {
    // const { code, domain } = options;
    const { authCode } = options;
    const kakaoKey = 'f5e1a07602f990e33e12b2ce3fb5d248';
    const kakaoTokenUrl = 'https://kauth.kakao.com/oauth/token'; //토큰받기
    const kakaoUserInfoUrl = 'https://kapi.kakao.com/v2/user/me'; //사용자정보받기

    const body = {
      grant_type: 'authorization_code',
      client_id: kakaoKey,
      // redirect_uri: `${domain}/kakao-callback`,
      redirect_uri: 'http://localhost:3000/auth/kakaoRedirect', //인가코드가 리다이렉트된 URI
      code: authCode, //프론트로부터 받은 인가코드
    };
    const headers = {
      'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    };
    try {
      const response = await axios({
        method: 'POST',
        url: kakaoTokenUrl,
        timeout: 30000,
        headers,
        data: qs.stringify(body),
      });
      if (response.status === 200) {
        //토큰을 받았을 경우

        const headerUserInfo = {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          Authorization: 'Bearer ' + response.data.access_token,
        };

        //사용자 정보 가져오기
        const responseUserInfo = await axios({
          method: 'GET',
          url: kakaoUserInfoUrl,
          timeout: 30000,
          headers: headerUserInfo,
        });

        if (responseUserInfo.status === 200) {
          const kakaoData = responseUserInfo.data;

          const { email } = kakaoData.kakao_account;
          const existUser = await this.usersRepository.findEmail(email);

          if (!existUser) {
            const {
              email,
              profile: { nickname, profile_image_url },
            } = kakaoData.kakao_account;

            const saveUserInfo = { email, nickname, profile_image_url };
            await this.usersRepository.saveUserInfo(saveUserInfo);
          }

          return kakaoData; //accessToken으로 변경
        } else {
          throw new UnauthorizedException();
        }
      } else {
        throw new UnauthorizedException();
      }
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async accessToken(email: string): Promise<any> {
    try {
      const payload = {
        email: email,
      };
      const access_token = this.jwtService.sign(payload); // AccessToken 생성

      return {
        access_token: access_token,
      };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  // async getUserInfo(checkInfo): Promise<any> {
  //   const user = await this.usersRepository.getUserInfo(checkInfo);

  //   if (!user) {
  //     throw new NotFoundException('사용자 정보가 없습니다');
  //   } else {
  //     return user;
  //   }
  // }

  async verifyTokenAndUserInfo(accesstoken: string): Promise<any> {
    // const decodedToken = this.jwtService.decode(accesstoken);
    const decodedToken = this.jwtService.verify(accesstoken); //토큰의 무결성 검증 및 payload 반환
    const userEmail = decodedToken['email'];

    try {
      if (!userEmail) {
        //accessToken에 email없을경우

        throw new UnauthorizedException();
      } else {
        const existUserEmail = await this.usersRepository.findEmail(userEmail);
        if (!existUserEmail) {
          throw new UnauthorizedException();
        } else {
          return await this.usersRepository.getUserInfo(userEmail);
        }
      }
    } catch (error) {
      if (error instanceof UnauthorizedException && userEmail) {
        const newAccessToken = await this.accessToken(userEmail);
        return {
          access_token: newAccessToken,
        };
      }
      throw new UnauthorizedException();
    }
  }

  //   async tokenValidateUser(payload: any): Promise<any> {
  //     return await this.usersRepository.tokenValidateUser(payload);
  // }

  // async dummpyData(user_id: number, email: string, nickname: string, profile: string): Promise<UsersEntity|any> {

  //   return await this.usersRepository.dummpyData();
  // }

  // async dummyData(
  //   user_id: number,
  //   email: string,
  //   nickname: string,
  //   profile: string,
  // ) {
  //   for (let i = 0; i < 10; i++) {

  //     for(let j=0; j<10; j++){
  //       user_id = 4+j

  //     }

  //   }

  //   return 'ok';
  // }
}
