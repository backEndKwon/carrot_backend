import {
  HttpException,
  Injectable,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import { EntityManager, In } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { BizsRepository } from 'src/bizs/bizs.repository';
import { PostsEntity } from './posts.entity';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly bizsRepository: BizsRepository,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}
  // 1.게시글 작성
  async createPost(
    user_id: number,
    title: string,
    content: string,
    min_price: number,
    photo_ip: string[],
    dueToDate: string,
  ): Promise<any> {
    try {
      if (!user_id) throw new NotFoundException('유저아이디 필수');
      const existUser = await this.postsRepository.findUser(user_id);
      if (!existUser) {
        throw new NotFoundException('해당 유저가 존재하지 않습니다.');
      }
      if (!title) throw new NotFoundException('제목 필수');
      if (!content) throw new NotFoundException('내용 필수');
      if (!min_price) throw new NotFoundException('최소가격 필수');
      if (!photo_ip) throw new NotFoundException('사진 등록 필수');
      console.log('===========> ~ photo_ip:', photo_ip);

      const currentDate = new Date();
      const dueDate = new Date(Date.parse(dueToDate));
      console.log('===========> ~ dueDate:', dueDate);
      console.log('===========> ~ currentDate:', currentDate);
      if (dueDate <= currentDate) {
        throw new NotFoundException('만료일을 다시 설정해주십시오');
      }
      if (!dueToDate) throw new NotFoundException('만료 시간 필수');

      return await this.postsRepository.createPost(
        user_id,
        title,
        content,
        min_price,
        photo_ip,
        dueToDate,
      );
      //user테이블의 post_itmes에 post_id추가 로직 구현 해야됨
    } catch (error) {
      console.log(error);
    }
  }

  // 2.게시글 전체조회
  async getAllPosts() {
    return await this.postsRepository.getAllPosts();
  }

  // 3.게시글 상세조회
  async getDetailPost(post_id: number) {
    try {
      const existPost = await this.postsRepository.getDetailPost(post_id);
      if (!existPost) throw new NotFoundException('해당 게시글 없음');
      return existPost;
    } catch (error) {
      console.log(error);
      try {
        const existPost = await this.postsRepository.getDetailPost(post_id);
        if (!existPost) throw new NotFoundException('해당 게시글 없음');
        return existPost;
      } catch (error) {
        console.log(error);
      }
      return 'ok';
    }
  }
  // 4.가격입찰//
  //나중에 시간되면 biz service로 빼기
  async updateBizPrice(user_id: number, post_id: number, biz_price: number) {
    try {
      return await this.entityManager.transaction(
        'READ COMMITTED',
        async () => {
          const existPost = await this.postsRepository.getDetailPost(post_id);

          if (existPost.user_id === user_id) {
            throw new NotFoundException('본인 게시글에 입찰 할 수 없습니다');
          }
          if (!existPost) {
            throw new NotFoundException('해당 게시글이 존재하지 않음');
          }
          if (existPost.biz_price >= biz_price) {
            throw new NotFoundException('입찰가는 현재가격보다 커야됨');
          }
          if (existPost.min_price > biz_price) {
            throw new NotFoundException('입찰가는 최초가격보다 커야됨');
          }

          //정상적으로 입력되었을 경우
          // 4-1 post 테이블 biz_count += 1
          await this.postsRepository.bizCountUp(post_id);
          // 4-2 post 테이블 biz_price update
          await this.postsRepository.bizPriceUpdate(biz_price, post_id);
          // 4-3 기간 만료되었을경우? post 테이블의 is_sold 변경
          await this.updateSoldStatus(post_id);
          // 4-4 biz table 업데이트
          await this.postsRepository.saveBiz(user_id, post_id, biz_price);
          return '입찰 성공';
        },
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        error.response, error.status;
      }
    }
  }

  async updateSoldStatus(post_id: number) {
    try {
      const expiredPosts = await this.postsRepository.isSoldUpdate(post_id);
      if (expiredPosts.length > 0) {
        await Promise.all(
          expiredPosts.map(async (post) => {
            post.is_sold = true;
            await this.postsRepository.save(post);
          }),
        );
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        error.response, error.status;
      }
    }
  }

  //나중에 시간되면 biz service로 빼기
  async getRealtimePrice(post_id: number) {
    const postId = post_id;
    try {
      const bizInfo = await this.bizsRepository.getAllBizPost(postId);

      if (!bizInfo || bizInfo.length === 0) {
        throw new NotFoundException('해당 게시글 입찰내역 없음');
      }

      // 현재 시간과 생성일자(createdAt) 사이의 차이를 계산하여 가장 가까운 값을 찾습니다.
      const currentTime = new Date();
      let closestTimeDiff = Math.abs(
        currentTime.getTime() - bizInfo[0].createdAt.getTime(),
      );
      let closestIndex = 0;

      for (let i = 1; i < bizInfo.length; i++) {
        const timeDiff = Math.abs(
          currentTime.getTime() - bizInfo[i].createdAt.getTime(),
        );
        if (timeDiff < closestTimeDiff) {
          closestTimeDiff = timeDiff;
          closestIndex = i;
        }
      }

      // 가장 가까운 값을 찾아서 반환합니다.
      const closestBizInfo = bizInfo[closestIndex];
      console.log('===========> ~ closestBizInfo:', closestBizInfo);
      const { biz_id, user_id, post_id, biz_price } = closestBizInfo;

      return { biz_id, user_id, post_id, biz_price };
    } catch (error) {
      // 예외 처리를 해주어야 중복된 post_id로 인한 오류가 발생하지 않습니다.
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        error.response, error.status;
      }
    }
  }

  // 5-1. 해당 게시글 전체 입찰내역 조회
  async getAllBizPost(post_id: number) {
    const bizInfo = await this.bizsRepository.getAllBizPost(post_id);
    try {
      if (bizInfo.length === 0) throw new NotFoundException('해당 게시글 없음');
      console.log('5-1===========> ~ bizInfo:', bizInfo);
      return bizInfo;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        error.response, error.status;
      }
    }
  }

  // //6. 게시글 생성 더미데이터
  // async dummyData() {
  //   const numberOfUsers = 2000;
  //   const dummyPost: PostsEntity[] = [];

  //   for (let i = 0; i < numberOfUsers; i++) {
  //     // 더미 데이터 생성
  //     let user_id = Math.floor(Math.random() * 1000)+1

  //     const post: PostsEntity = new PostsEntity();

  //     post.title = `${i}번째 title 제목`;
  //     post.content = `${i}내용입니다. 얼른 사세요`;
  //     post.min_price = user_id*10;
  //     post.user_id = user_id;
  //     post.dueToDate = `2023-08-05`;
  //     post.photo_ip = [`image_${i}.jpg`,`image_${i+1}.jpg`];
  //     dummyPost.push(post);
  //   }

  //   // 생성한 더미 데이터를 user 테이블에 저장
  //   await this.postsRepository.dummyData(dummyPost);
  // }

  // async dummyBizData() {

  //   await this.bizsRepository.dummyBizData();
  // }
}
