import { Module } from "@nestjs/common";
import { SocketGateway } from "./ws.gateway";

@Module({
  exports: [SocketGateway],
  providers: [SocketGateway]
})
export class SocketModule {}