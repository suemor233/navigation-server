import { StackService } from './stack.service';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Auth } from '~/common/decorator/auth.decorator';
import { ApiName } from '~/common/decorator/openapi.decorator';
import { StackModel } from './stack.dto';

@ApiName
@Controller('stack')
export class StackController {
  constructor(private readonly StackService: StackService) {}
  
  @Post()
  @Auth()
  @ApiOperation({ summary: '添加基本介绍' })
  async create(@Body() Stack: StackModel[]) {
    return await this.StackService.createStack(Stack)
  }

  @Get()
  @ApiOperation({ summary: '获取基本介绍' })
  async StackInfo() {
    return await this.StackService.StackInfo()
  }
 


}
