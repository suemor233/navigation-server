import { Module } from '@nestjs/common';
import { AggregateService } from './aggregate.service';
import { AggregateController } from './aggregate.controller';

@Module({
  controllers: [AggregateController],
  providers: [AggregateService]
})
export class AggregateModule {}
