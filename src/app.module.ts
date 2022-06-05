import { Module, NestModule, Type } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './processors/database/database.module';
import { AllExceptionsFilter } from './common/filters/any-exception.filter'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptors/response.interceptor'
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule
  ].filter(Boolean) as Type<NestModule>[],
  controllers: [AppController],
  providers:[
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor, // 1
    },
  ]
})
export class AppModule {}
