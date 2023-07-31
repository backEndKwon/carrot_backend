import { Injectable, NotFoundException } from '@nestjs/common';
import { PostsRepository } from './posts.repository';


@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
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
      if (!user_id) throw new Error('유저아이디 필수');
      const existUser = await this.postsRepository.findUser(user_id);
      if (!existUser) {
        throw new NotFoundException('해당 유저가 존재하지 않습니다.');
      }
      if (!title) throw new Error('제목 필수');
      if (!content) throw new Error('내용 필수');
      if (!min_price) throw new Error('최소가격 필수');
      if (!photo_ip) throw new Error('사진 등록 필수');

      const currentDate = new Date();
      const dueDate = new Date(Date.parse(dueToDate));
      console.log('===========> ~ dueDate:', dueDate);
      console.log('===========> ~ currentDate:', currentDate);
      if (dueDate <= currentDate) {
        throw new Error('만료일을 다시 설정해주십시오');
      }
      if (!dueToDate) throw new Error('만료 시간 필수');
      await this.postsRepository.createPost(
        user_id,
        title,
        content,
        min_price,
        photo_ip,
        dueToDate,
      );
      //user테이블의 post_itmes에 post_id추가 로직 구현 해야됨
      return 'ok';
    } catch (error) {
      console.log(error);
    }
  }

  // 2.게시글 전체조회
  async getAllPosts() {
    await this.postsRepository.getAllPosts();
    return 'ok';
  }

  // 3.게시글 상세조회
  async getDetailPost(post_id: number) {
    try {
      const existPost = await this.postsRepository.getDetailPost(post_id);
      if (!existPost) throw new Error('해당 게시글 없음');
      return existPost;
    } catch (error) {
      console.log(error);
    }
    return 'ok';
  }

  // 4.가격입찰
  async updateBizPrice(user_id: number, post_id: number, biz_price: number) {
    const existPost = await this.postsRepository.getDetailPost(post_id);
    console.log('===========> ~ existPost.user_id:', existPost.user_id);
    console.log('===========> ~ user_id:', user_id);

    if (existPost.user_id === user_id) {
      throw new Error('본인 게시글에 입찰 할 수 없습니다');
    }
    if (!existPost) {
      throw new Error('해당 게시글이 존재하지 않음');
    }
    console.log("===========> ~ existPost.biz_price:", existPost.biz_price)
    console.log("===========> ~ biz_price:", biz_price)
    if (existPost.biz_price >= biz_price) {
      throw new Error('입찰가는 현재가격보다 커야됨');
    }
    if (existPost.min_price > biz_price) {
      throw new Error('입찰가는 최초가격보다 커야됨');
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
    return 'ok';
  }

  async updateSoldStatus(post_id: number) {
    const expiredPosts = await this.postsRepository.isSoldUpdate(post_id);

    if (expiredPosts.length > 0) {
      await Promise.all(
        expiredPosts.map(async (post) => {
          post.is_sold = true;
          await this.postsRepository.save(post);
        }),
      );
    }
  }
}
