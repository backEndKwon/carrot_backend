import { Injectable } from '@nestjs/common';
import { PostsRepository } from './posts.repository';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  // 1.게시글 작성
  async createPost(
    title: string,
    content: string,
    min_price: number,
    photo_ip: string,
    dueToDate: Date,
  ): Promise<any> {
    if (!title) throw new Error('제목 필수');
    if (!content) throw new Error('내용 필수');
    if (!min_price) throw new Error('최소가격 필수');
    if (!photo_ip) throw new Error('사진 등록 필수');
    return await this.postsRepository.createPost(
      title,
      content,
      min_price,
      photo_ip,
      dueToDate,
    );
  }

  // 2.게시글 전체조회
  async getAllPosts() {
    return await this.postsRepository.getAllPosts();
  }

  // 3.게시글 상세조회
  async getDetailPost(post_id: number) {
    if (!post_id) throw new Error('해당 게시글 없음');
    return await this.postsRepository.getDetailPost(post_id);
  }

  // 4.가격입찰
  async updateBizPrice(user_id: number, post_id: number, biz_price: number) {
    return await this.postsRepository.updateBizPrice(
      user_id,
      post_id,
      biz_price,
    );
  }
}
