import { Controller, Get } from '@nestjs/common';
import { Auth } from '~/common/decorator/auth.decorator';
import { ApiName } from '~/common/decorator/openapi.decorator';
import { AggregateService } from './aggregate.service';

@Controller('aggregate')
@ApiName
export class AggregateController {
  constructor(private readonly aggregateService: AggregateService) {}

  @Get('/stat')
  @Auth()
  async Stat() {
    return this.aggregateService.getCounts();
  }
}
