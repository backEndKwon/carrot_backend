import { Repository, DataSource, LessThanOrEqual } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { PostsEntity } from './posts.entity';
// import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from '../users/users.repository';
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

  // 4. 가격입찰
  // 4-1 해당 포스트 찾기
  async findOnePost(user_id: number, post_id: number): Promise<PostsEntity> {
    const existPost = await this.findOne({ where: { post_id, user_id } });
    return existPost;
  }

  // 4-2 해당 post의 biz_count += 1
  async bizCountUp(post_id: number) {
    const post = await this.getDetailPost(post_id);
    post.biz_count += 1;
    await this.save(post);
  }

  // 4-3 해당 post의 biz_price update
  async bizPriceUpdate(biz_price: number, post_id: number) {
    const post = await this.getDetailPost(post_id);
    post.biz_price = biz_price;
    await this.save(post);
  }

  // 4-4 해당 post의 입찰 했을 경우 biz 테이블 데이터 생성
  async saveBiz(user_id: number, post_id: number, biz_price: number) {
    const saveBiz = this.bizsRepository.create({
      user_id,
      post_id,
      biz_price,
    });
    await this.bizsRepository.save(saveBiz);
  }

  // 4-5 is_sold 변경
  async isSoldUpdate(post_id: number) {
    const existPost = await this.getDetailPost(post_id);
    const currentDate = new Date();

    const expiredPosts = await this.find({
      where: {
        dueToDate: String(LessThanOrEqual(currentDate)),
        is_sold: false,
      },
    });
    return expiredPosts;
  }

  // //6. 게시글 생성 더미데이터
  //   async dummyData(dummyUsers) {
  //     for (const user of dummyUsers) {
  //       let { title, content, min_price, user_id, dueToDate, photo_ip } = user;
  //       const saveUserInfo = this.create({
  //         user_id,
  //         title,
  //         content,
  //         min_price,
  //         dueToDate,
  //         photo_ip
  //       });

  //       console.log('===========> ~ saveUserInfo:', saveUserInfo);
  //       await this.save(saveUserInfo);
  //     }
  //   }
}
