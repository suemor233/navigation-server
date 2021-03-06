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
import { StackModule } from './modules/stack/stack.module';
import { CacheModule } from './processors/cache/cache.module';
import { HttpCacheInterceptor } from './common/interceptors/cache.interceptor';
import { AggregateModule } from './modules/aggregate/aggregate.module';
import { AnalyzeModule } from './modules/analyze/analyze.module';
import { AnalyzeInterceptor } from './common/interceptors/analyze.interceptor';
import { ToolModule } from './modules/tool/tool.module';
import { HelperModule } from './processors/helper/helper.module'
@Module({
  imports: [
    DatabaseModule,
    CacheModule,
    UserModule,
    AboutModule,
    ProjectModule,
    StackModule,
    AggregateModule,
    AnalyzeModule,
    ToolModule,
    HelperModule
  ].filter(Boolean) as Type<NestModule>[],
  controllers: [AppController],
  providers:[
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AnalyzeInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpCacheInterceptor, // 4
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor, // 1
    },
    SocketGateway,
  ]
})
export class AppModule {}
