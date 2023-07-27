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

  async saveUserInfo(kakao: any): Promise<UsersEntity> {
    const kakao_info = JSON.parse(kakao);
    const email = kakao_info.kakao_account.email;
    const isEmail = await this.findOne({ where: { email } });
    console.log('isEmail, db내 이메일 있습니까????', isEmail);
    if (!isEmail) {
      const usersInfo = this.create({
        email: kakao_info.kakao_account.email,
        nickname: kakao_info.properties.nickname,
        profile: kakao_info.properties.profile_image,
      });

      console.log('repository/saveUser check');
      return await this.save(usersInfo);
    }
  }

  // async findEmail(email:string): Promise<UsersEntity> {
  //   return await this.findOne({ where:{email} });
  // }
}
