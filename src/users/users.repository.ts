import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UsersEntity } from './users.entity';
// import { Cron, CronExpression } from '@nestjs/schedule';
interface SaveUserInfo {
  email: string;
  nickname: string;
  profile_image_url: string;
}
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

  async saveUserInfo(saveUserInfo: SaveUserInfo): Promise<any> {
    const { email, nickname, profile_image_url } = saveUserInfo;
    const existUser = await this.findOne({ where: { email } }); //db내 이메일 있는지 확인
    console.log('repo/existUser======================', existUser);
    if (!existUser) {
      const usersInfo = this.create({
        email,
        nickname,
        profile: profile_image_url,
      });
      return await this.save(usersInfo);
    }
  }
  async findEmail(email: string): Promise<string> {
    console.log('---------------------------------------');
    const user = await this.findOne({ where: { email } });
    if (!user) {
      return null;
    }
    return user.email;
  }

  async getUserInfo(email: string): Promise<any> {
    const userInfo = await this.findOne({ where: { email: email } });
    console.log('repository/user', userInfo);
    const { user_id, nickname, profile } = userInfo;

    return { user_id, nickname, profile };
  }

  async tokenValidateUser(payload: any): Promise<any> {
    const email = payload.email;
    return await this.findOne({ where: { email } });
  }

  async dummyData(dummyUsers) {
    console.log("===========> ~ dummyUsers:", dummyUsers)
    
    for (const user of dummyUsers) {
      let { email, nickname, profile } = user;
      const saveUserInfo = this.create({
        email,
        nickname,
        profile,
      });
      
      console.log("===========> ~ saveUserInfo:", saveUserInfo)
      await this.save(saveUserInfo);
    }
  }
}
