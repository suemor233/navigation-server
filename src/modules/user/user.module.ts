import { AuthModule } from './../auth/auth.module';
import { SocketModule } from './../../processors/gateway/ws.module';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';



@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [SocketModule,AuthModule],
  exports: [UserService],
})
export class UserModule {}
