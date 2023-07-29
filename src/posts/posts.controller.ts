import { Controller, Body, Get, Post, Param, Patch } from '@nestjs/common';
import { PostsEntity } from './posts.entity';
import { PostsService } from './posts.service';
@Controller('post')
export class PostsController {
  constructor(private postsService: PostsService) {}

  // 1.게시글 작성
  @Post('/posts')
  async createPost(@Body() body: PostsEntity) {
    const { title, content, min_price, photo_ip, dueToDate } = body;
    console.log(title, content, min_price, photo_ip);
    return await this.postsService.createPost(
      title,
      content,
      min_price,
      photo_ip,
      dueToDate,
    );
  }

  // 2.게시글 전체조회
  @Get('/posts')
  async getAllPosts() {
    return await this.postsService.getAllPosts();
  }

  // 3.게시글 상세조회
  @Get('/posts/:post_id')
  async getDetailPost(@Param('post_id') post_id: number) {
    return await this.postsService.getDetailPost(post_id);
  }

  // 4.가격입찰
  @Patch('/posts/:user_id/:post_id')
  async updateBizPrice(
    @Param('post_id') post_id: number,
    @Param('user_id') user_id: number,
    @Body() body: { biz_price: number },
  ) {
    const { biz_price } = body;
    return await this.postsService.updateBizPrice(user_id, post_id, biz_price);
  }
}
