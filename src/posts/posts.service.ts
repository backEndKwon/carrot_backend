import { Injectable, NotFoundException } from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import { error } from 'console';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  // 1.게시글 작성
  //만료시간이 현재시간보다 이전일 경우 오류
  async createPost(
    user_id: number,
    title: string,
    content: string,
    min_price: number,
    photo_ip: string[],
    dueToDate: string,
  ): Promise<any> {
    //uerid user테이블 존재 확인-> 각 옵션 입력확인 ->
    //post생성 -> 생성한 유저의 post_items에 추가
    const existUser = await this.postsRepository.findUser(user_id);
    if (!existUser) {
      throw new NotFoundException('해당 유저가 존재하지 않습니다.');
    }
    if (!title) throw new Error('제목 필수');
    if (!content) throw new Error('내용 필수');
    if (!min_price) throw new Error('최소가격 필수');
    if (!photo_ip) throw new Error('사진 등록 필수');
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
  }

  // 2.게시글 전체조회
  async getAllPosts() {
    return await this.postsRepository.getAllPosts();
  }

  // 3.게시글 상세조회
  async getDetailPost(post_id: number) {
    try {
      const existPost = await this.postsRepository.getDetailPost(post_id);
      if (!existPost) throw new Error('해당 게시글 없음');
      return existPost;
    } catch (error) {
      try {
        const existPost = await this.postsRepository.getDetailPost(post_id);
        if (!existPost) throw new Error('해당 게시글 없음');
        return existPost;
      } catch (error) {}
      return 'ok';
    }
  }
  // 4.가격입찰
  async updateBizPrice(user_id: number, post_id: number, biz_price: number) {
    //해당 포스트 찾기-> if(입력한 가격이 &&is_sold&&dueToDate확인)-> user테이블 biz_items추가, 가격(biz_price)수정 -> 테이블내
    //(1) 해당 포스트 가격비교 후 post[가격&&입찰카운트],  update
    const existPost = await this.postsRepository.getDetailPost(post_id);

    //

    if (existPost.user_id === user_id) {
      throw new Error('본인 게시글에 입찰 할 수 없습니다');
    }
    if (!existPost) {
      throw new Error('해당 게시글이 존재하지 않음');
    }

    if (existPost.biz_price >= biz_price) {
      throw new Error('입찰가는 현재가격보다 커야됨');
    }
    if (existPost.min_price > biz_price) {
      throw new Error('입찰가는 최초가격보다 커야됨');
    }

    //정상적으로 입력되었을 경우s
    await this.postsRepository.bizCountUp(post_id);
    // await this.postsRepository.pushPostId(user_id,post_id)
    await this.postsRepository.bizPriceUpdate(biz_price, post_id);
    //biz table 업데이트
    await this.postsRepository.saveBiz(user_id, post_id, biz_price);
    return 'ok';
  }
}
