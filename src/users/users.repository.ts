import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UsersEntity } from './users.entity';
// import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class UsersRepository extends Repository<UsersEntity> {
  constructor(private dataSource: DataSource) {
    super(UsersEntity, dataSource.createEntityManager());
  }

  async findEmailAndUserId(email: string): Promise<UsersEntity | boolean> {
    const user = await this.findOne({ where: { email } });
    if (user) {
      return false;
    }
    return true;
  }

  async saveUserInfo(kakao: any): Promise<UsersEntity | number> {
    const kakao_info = JSON.parse(kakao);
    const email = kakao_info.kakao_account.email;//카카오 이메일
    const isEmail = await this.findOne({ where: { email } });//db내 이메일 있는지 확인
    console.log('isEmail, db내 이메일 있습니까????', isEmail);
    if (!isEmail) {
      const usersInfo = this.create({
        email: kakao_info.kakao_account.email,
        nickname: kakao_info.properties.nickname,
        profile: kakao_info.properties.profile_image,
      });

      console.log('repository/saveUser check');
      await this.save(usersInfo);
      return isEmail.user_id;
    }
  }

  async getUserInfo(checkInfo): Promise<any> {
    const { accessToken, userId } = checkInfo;
    const user = await this.findOne({ where: { user_id: userId } });
    return user;
  }
}
