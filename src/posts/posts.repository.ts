import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { PostsEntity } from './posts.entity';
// import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from '../users/users.repository';
@Injectable()
export class PostsRepository extends Repository<PostsEntity> {
  constructor(
    // @InjectRepository(UsersRepository) // User 레파지토리를 주입합니다.
    // private readonly userRepository: UsersRepository,
    private dataSource: DataSource,
  ) {
    super(PostsEntity, dataSource.createEntityManager());
  }

  // 1.게시글 작성
  async createPost(
    title: string,
    content: string,
    min_price: number,
    photo_ip: string,
    dueToDate : Date,
  ): Promise<any> {
    const savePost = this.create({
      title: title,
      content: content,
      min_price: min_price,
      photo_ip: photo_ip,
      dueToDate: dueToDate,
    });
    return await this.save(savePost);
  }

  // 2.게시글 전체조회
  async getAllPosts() {
    const posts = await this.find();
    return posts;
  }

  // 3.게시글 상세조회
  async getDetailPost(post_id: number) {
    const detailPost = await this.findOne({ where: { post_id: post_id } });

    return detailPost;
  }

  // 4.가격입찰
  async updateBizPrice(user_id: number, post_id: number, biz_price: number) {
    const detailPost = await this.findOne({ where: { post_id: post_id } });
 

    // post_items에 post_id를 추가합니다. (중복 방지)
    // const userInfo = await this.userRepository.findOne({ where: { user_id } });
    // if (!userInfo.post_items.includes(post_id)) {
    //   userInfo.post_items.push(post_id);
    // await userInfo.save();
    // }

    const bizPrize = biz_price;
    const prePrize = detailPost.biz_price;

    //가격 입찰시 이전 가격보다 높은거 확인 후 +1, 저장
    if (prePrize < bizPrize) {
      detailPost.biz_count += 1;
    }
    await detailPost.save();
    return;
  }
}
