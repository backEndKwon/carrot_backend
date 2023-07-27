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
    console.log('repository/사용자 정보 저장완료');

    const usersInfo = this.create({
      email: kakao.kakao_account.email,
      nickname: kakao.properties.nickname,
      profile: kakao.properties.profile_image,
    });


    console.log('repository/saveUser===', usersInfo);
    return await this.save(usersInfo);
  }

  // async findEmail(email:string): Promise<UsersEntity> {
  //   return await this.findOne({ where:{email} });
  // }
}
