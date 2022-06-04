import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './modules/user/user.module';

@Module({
  controllers: [AppController],
  imports: [UserModule],
})
export class AppModule {}
