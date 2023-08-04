import { Logger, NotFoundException } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { time } from 'console';
import { Server, Socket } from 'socket.io';
import { PostsRepository } from 'src/posts/posts.repository';
import { PostsService } from 'src/posts/posts.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class BizGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private PostsService: PostsService,
    private readonly postsRepository: PostsRepository,
  ) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('BizGateway');

  @SubscribeMessage('message')
  async handleMessage(client: Socket, payload: any) {
    try {
      const { post_id, biz_price } = payload;

      client.emit('sendPrice', { post_id, biz_price });

      return 'hello';
    } catch (error) {
      console.error('오류 발생:', error.message);
      client.emit('error', { message: error.message });
      return 'biz gateway 오류발생';
    }
  }
  afterInit(server: Server) {
    server.on('connection', (socket) => {
      // console.log("===========> ~ socket:", socket)
      
      socket.on('sendPrice', async (data) => {
        console.log("===========> ~ data:", data)
        try {
          
          console.log("==>",typeof(data))
          console.log("==>",data.price)
          const { user_id, post_id, price } = data;
          const existPost = await this.postsRepository.getDetailPost(post_id);

          console.log('===========> ~ price:', price);
          console.log('===========> ~ post_id:', post_id);
          console.log('===========> ~ user_id:', user_id);
          if (!user_id || user_id === undefined) {
            socket.emit('sendErrorToClient', 'user_id값이 없음');
            return;
          }
          if (!data) {
            socket.emit('sendErrorToClient', 'data값이 없음');
            return;
          }
          if (price === undefined) {
            socket.emit('sendErrorToClient', 'price값이 없음');
            return;
          }
          if (existPost === null) {
            socket.emit('sendErrorToClient', '해당 게시글이 존재하지 않음');
            return;
          }
          if (price === null || existPost.biz_price >= price) {
            socket.emit('sendErrorToClient', '입찰가는 현재가격보다 커야됨');
            return;
          }
          if (existPost.min_price > price) {
            socket.emit('sendErrorToClient', '입찰가는 최초가격보다 커야됨');
            return;
          }

          await this.PostsService.updateBizPrice(user_id, post_id, price);
          socket.emit('sendPriceToClient', data);
          console.log('===========> ~ data:', data);
          console.log('저장완료');
        } catch (error) {
          console.error('오류 발생:', error.message);
          socket.emit('sendErrorToClient', '내부 에러 발생');
        }
      });
    });

    this.logger.log('Initialized!');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    console.log('소켓===========> ~ client:', client.rooms);
  }
}
