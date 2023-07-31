import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { PostsEntity } from './posts.entity';
// import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from '../users/users.repository';
import { UsersEntity } from 'src/users/users.entity';
import { BizsRepository } from 'src/bizs/bizs.repository';
@Injectable()
export class PostsRepository extends Repository<PostsEntity> {
  constructor(
    @InjectRepository(UsersRepository) // User 레파지토리를 주입합니다.
    private readonly userRepository: UsersRepository,
    @InjectRepository(BizsRepository) // User 레파지토리를 주입합니다.
    private readonly bizsRepository: BizsRepository,
    private dataSource: DataSource,
  ) {
    super(PostsEntity, dataSource.createEntityManager());
  }

  async findUser(user_id: number) {
    const existUser = await this.userRepository.findOne({ where: { user_id } });
    return existUser;
  }

  // 1.게시글 작성
  async createPost(
    user_id: number,
    title: string,
    content: string,
    min_price: number,
    photo_ip: string[],
    dueToDate: string,
  ): Promise<any> {
    const savePost = this.create({
      user_id,
      title,
      content,
      min_price,
      photo_ip,
      dueToDate,
    });
    await this.save(savePost);
  }

  // 2.게시글 전체조회
  async getAllPosts() {
    const posts = await this.find();
    return posts;
  }

  // 3.게시글 상세조회
  async getDetailPost(post_id: number) {
    const detailPost = await this.findOne({ where: { post_id } });

    return detailPost;
  }

  // 4.가격입찰
  // async updateBizPrice(user_id: number, post_id: number, biz_price: number) {
  //   const detailPost = await this.findOne({ where: { post_id } });

  //   // post_items에 post_id를 추가합니다. (중복 방지)
  //   // const userInfo = await this.userRepository.findOne({ where: { user_id } });
  //   // if (!userInfo.post_items.includes(post_id)) {
  //   //   userInfo.post_items.push(post_id);
  //   // await userInfo.save();
  //   // }

  //   const bizPrize = biz_price;
  //   const prePrize = detailPost.biz_price;

  //   //가격 입찰시 이전 가격보다 높은거 확인 후 +1, 저장
  //   if (prePrize < bizPrize) {
  //     detailPost.biz_count += 1;
  //   }
  //   await detailPost.save();
  //   return;
  // }

  //특정 유저의 post
  async findOnePost(user_id: number, post_id: number): Promise<PostsEntity> {
    const existPost = await this.findOne({ where: { post_id, user_id } });
    return existPost;
  }

  //post의 biz_count += 1
  //post의 biz_price update
  //해당 user테이블의 biz_times에 post_id 삽입
  async bizCountUp(post_id: number) {
    const post = await this.getDetailPost(post_id);
    post.biz_count += 1;
    await this.save(post);
  }
  // async bizCountUp(post_id: number): Promise<void> {
  //   await this.query(
  //     `
  //       UPDATE Posts SET biz_count = biz_count + 1 WHERE post_id = ${_id};
  //     `,
  //   );
  // }



  async bizPriceUpdate(biz_price: number, post_id: number) {
    const post = await this.getDetailPost(post_id);
    post.biz_price = biz_price;
    await this.save(post);
  }
  // async pushPostId(user_id: number, post_id: number) {
  //   const user = await this.findUser(user_id);
  //   // if (!user.biz_items) {
  //   //   user.biz_items = [];
  //   // }

  //   // user.biz_items.push(post_id);
  //   // await this.save(user);
  //   if (user) {
  //     user.biz_items.push(post_id);
  //     await this.userRepository.save(user);
  //   } else {
  //     throw new Error("User not found");
  //   }
  // }
  async saveBiz(user_id: number, post_id: number, biz_price: number) {
    const saveBiz = this.bizsRepository.create({
      user_id,
      post_id,
      biz_price,
    });
    await this.bizsRepository.save(saveBiz);
  }
}
