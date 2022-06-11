import { SocketModule } from './../../processors/gateway/ws.module';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

import { AuthModule } from '../auth/auth.module';



@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [AuthModule,SocketModule],
  exports: [UserService],
})
export class UserModule {}
