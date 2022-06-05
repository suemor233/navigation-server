import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Root')
export class AppController {

  @Get('/ping')
  ping(): 'pong' {
    return 'pong'
  }
}
