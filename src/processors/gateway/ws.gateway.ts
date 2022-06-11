import { WebSocketServer, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";

import { Server } from "socket.io";
@WebSocketGateway(2347,{
  allowEIO3: true,
  cors: {
    origin: /.*/,
    credentials: true
  }
})
export class SocketGateway {


  //供其它模块调用
  @WebSocketServer()
  server: Server;

}