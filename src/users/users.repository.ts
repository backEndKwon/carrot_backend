import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UsersEntity } from './users.entity';
// import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class UsersRepository extends Repository<UsersEntity> {
  constructor(private dataSource: DataSource) {
    super(UsersEntity, dataSource.createEntityManager());
  }

  // async findEmailAndUserId(email: string): Promise<UsersEntity | boolean> {
  //   const user = await this.findOne({ where: { email } });
  //   if (user) {
  //     return false;
  //   }
  //   return true;
  // }

  async saveUserInfo(kakao_info:any): Promise<any> {
    const email = kakao_info.kakao_account.email
    const existUser = await this.findOne({ where: { email } }); //db내 이메일 있는지 확인
    console.log('repo/existUser======================', existUser);
    if (!existUser) {
      const usersInfo = this.create({
        email: kakao_info.kakao_account.email,
        nickname: kakao_info.properties.nickname,
        profile: kakao_info.properties.profile_image,
      });
      return await this.save(usersInfo);

      //   console.log('repository/saveUser===================',savedUser.user_id);
      //   return savedUser.user_id;
      // }
      // return existUser.user_id;
    }
  }
  async findEmail(email: string): Promise<string> {
    const user = await this.findOne({ where: { email } });
    return user.email;
  }

  // async getUserInfo(checkInfo): Promise<any> {
  //   const { accessToken, userId } = checkInfo;
  //   const user = await this.findOne({ where: { user_id: userId } });
  //   console.log('repository/user', user);
  //   return user;
  // }
}
