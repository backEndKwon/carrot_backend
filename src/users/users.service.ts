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
import { get } from 'http';
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
      redirect_uri: 'https://carrot-three.vercel.app/auth/kakaoRedirect', //인가코드가 리다이렉트된 URI
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
        console.log(`kakaoToken : ${JSON.stringify(response.data)}`);
        // Token 을 가져왔을 경우 사용자 정보 조회
        const headerUserInfo = {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          Authorization: 'Bearer ' + response.data.access_token,
        };
        // console.log(`url : ${kakaoTokenUrl}`);
        // console.log(`headers : ${JSON.stringify(headerUserInfo)}`);

        const responseUserInfo = await axios({
          method: 'GET',
          url: kakaoUserInfoUrl,
          timeout: 30000,
          headers: headerUserInfo,
        });

        console.log(`responseUserInfo.status : ${responseUserInfo.status}`);
        if (responseUserInfo.status === 200) {
          console.log(
            `S/kakaoUserInfo : ${JSON.stringify(responseUserInfo.data)}`,
          );
          await this.usersRepository.saveUserInfo(
            JSON.stringify(responseUserInfo.data),
          );
          //

          // const email = responseUserInfo.data.email;
          // const accessToken = this.getAccessToken(email);
          // return accessToken;

          //

          return responseUserInfo.data; //accessToken으로 변경
        } else {
          throw new UnauthorizedException();
        }
      } else {
        throw new UnauthorizedException();
      }
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }

  // async findEmailAndUserId(email: string): Promise<UsersEntity | boolean> {
  //   return await this.usersRepository.findEmailAndUserId(email);
  // }
  async saveUserInfo(kakao_info:any): Promise<UsersEntity> {
    return await this.usersRepository.saveUserInfo(kakao_info);
  }

  async accessToken(email:string): Promise<any> {
    // console.log("accessToken: ", kakao.kakao_account.email);
    try {
      const payload = {
        email: email,
      };
      const access_token = this.jwtService.sign(payload); // AccessToken 생성

        return {
          access_token: access_token,
        };
      
    } catch (error) {
      console.log('service/accessToken 발급==', error);
      throw new UnauthorizedException();
    }
  }
  
  async getUserInfo(checkInfo): Promise<any> {
    const user = await this.usersRepository.getUserInfo(checkInfo);

    if (!user) {
      throw new NotFoundException('사용자 정보가 없습니다');
    } else {
      return user;
    }
  }
}
