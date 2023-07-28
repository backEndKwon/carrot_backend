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

    }
  }
  async findEmail(email: string): Promise<string> {
    console.log("---------------------------------------")
    const user = await this.findOne({ where: { email } });
    return user.email;
  }

  async getUserInfo(email:string): Promise<any> {
    const userInfo = await this.findOne({ where: { email : email } });
    console.log('repository/user', userInfo);
    return userInfo;
  }

  async tokenValidateUser(payload: any): Promise<any> {
    const email = payload.email;
     return await this.findOne({where:{email}});
 }
}
