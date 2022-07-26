import { Module } from '@nestjs/common';
import { AggregateService } from './aggregate.service';
import { AggregateController } from './aggregate.controller';
import { UserModule } from '../user/user.module';
import { AboutModule } from '../about/about.module';
import { ProjectModule } from '../project/project.module';
import { StackModule } from '../stack/stack.module';
@Module({
  controllers: [AggregateController],
  providers: [AggregateService],
  imports:[UserModule,AboutModule,ProjectModule,StackModule]
})


export class AggregateModule {}
