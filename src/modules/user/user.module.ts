import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

import { AuthModule } from '../auth/auth.module';



@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [AuthModule],
  exports: [UserService],
})
export class UserModule {}
