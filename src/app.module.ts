import { Module, NestModule, Type } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './processors/database/database.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule
  ].filter(Boolean) as Type<NestModule>[],
  controllers: [AppController],
})
export class AppModule {}
