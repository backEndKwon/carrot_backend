import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import * as qs from 'qs';

@Injectable()
export class UsersService {
  async kakaoLogin(options: { code: string }): Promise<any> {
    // const { code, domain } = options;
    const { code } = options;
    const kakaoKey = 'f5e1a07602f990e33e12b2ce3fb5d248';
    const kakaoTokenUrl = 'https://kauth.kakao.com/oauth/token'; //토큰받기
    const kakaoUserInfoUrl = 'https://kapi.kakao.com/v2/user/me'; //사용자정보받기

    const body = {
      grant_type: 'authorization_code',
      client_id: kakaoKey,
      // redirect_uri: `${domain}/kakao-callback`,
      redirect_uri: `http://localhost:3000/auth/kakaoRedirect`, //인가코드가 리다이렉트된 URI
      code, //프론트로부터 받은 인가코드
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
        console.log(`url : ${kakaoTokenUrl}`);
        console.log(`headers : ${JSON.stringify(headerUserInfo)}`);

        const responseUserInfo = await axios({
          method: 'GET',
          url: kakaoUserInfoUrl,
          timeout: 30000,
          headers: headerUserInfo,
        });

        console.log(`responseUserInfo.status : ${responseUserInfo.status}`);
        if (responseUserInfo.status === 200) {
          console.log(
            `kakaoUserInfo : ${JSON.stringify(responseUserInfo.data)}`,
          );
          return responseUserInfo.data;
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
}
