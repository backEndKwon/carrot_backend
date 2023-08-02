import {
  Controller,
  Body,
  Get,
  Post,
  Param,
  Patch,
  Response,
} from '@nestjs/common';
import { PostsEntity } from './posts.entity';
import { PostsService } from './posts.service';

@Controller('post')
export class PostsController {
  constructor(private postsService: PostsService) {}

  // 1.게시글 작성
  @Post('/posts')
  async createPost(@Body() body: PostsEntity) {
    const { user_id, title, content, min_price, photo_ip, dueToDate } = body;
    return await this.postsService.createPost(
      user_id,
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

    const result = await this.postsService.updateBizPrice(
      user_id,
      post_id,
      biz_price,
    );
    return result;
  }

  // 5. 5초마다 update 실시간 가격변동 API
  @Get('/posts/realtime/:post_id')
  async getRealtimePrice(@Param('post_id') post_id: number) {
    const result = await this.postsService.getRealtimePrice(post_id);
    return result;
  }

  // 5-1. 해당 게시글 전체 입찰내역 조회
  @Get('/posts/biz/:post_id')
  async gerAllBizPost(@Param('post_id') post_id: number) {
    return await this.postsService.getAllBizPost(post_id);
  }

// //6. 게시글 생성 더미데이터
// @Get('/dummyData')
//   async dummyData() {
//     return await this.postsService.dummyData();
//   }

//   //7. 가격입찰 더미데이터
//   @Get('/dummyData/biz')
// async dummyBizData() {      
//   return await this.postsService.dummyBizData();  
// }
}
