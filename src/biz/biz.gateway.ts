import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
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
  constructor(private PostsService: PostsService) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('BizGateway');
 rks
  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): string {
    const { post_id, biz_price } = payload;
    client.emit('sendPrice', { post_id, biz_price });
    return 'Hello world!';
  }

  afterInit(server: Server) {
    server.on('connection', (socket) => {
      socket.on('sendPrice', (data) => {
        console.log('sendPrice==', data);
        socket.emit('sendPriceToClient', data);
        const { user_id, post_id, biz_price } = data;
        console.log("소켓===========> ~ price:", biz_price)
        console.log("소켓===========> ~ post_id:", post_id)
        console.log('소켓===========> ~ price:', biz_price);
        this.PostsService.updateBizPrice(user_id, post_id, biz_price);
      });
    });

    this.logger.log('Initialized!');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}
