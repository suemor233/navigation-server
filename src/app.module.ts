import { Module, NestModule, Type } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './modules/user/user.module';
import { AllExceptionsFilter } from './common/filters/any-exception.filter'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptors/response.interceptor'
import { SocketGateway } from './processors/gateway/ws.gateway';
import { DatabaseModule } from './processors/database/database.module';
import { AboutModule } from './modules/about/about.module';
import { ProjectModule } from './modules/project/project.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    AboutModule,
    ProjectModule
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
    SocketGateway,
  ]
})
export class AppModule {}
