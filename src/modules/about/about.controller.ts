import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Auth } from '~/common/decorator/auth.decorator';
import { ApiName } from '~/common/decorator/openapi.decorator';
import { AboutModel } from './about.dto';
import { AboutService } from './about.service';

@ApiName
@Controller('about')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}
  
  @Post()
  @Auth()
  @ApiOperation({ summary: '添加基本介绍' })
  async create(@Body() about: AboutModel[]) {
    return await this.aboutService.createAbout(about)
  }

  @Get()
  @ApiOperation({ summary: '获取基本介绍' })
  async aboutInfo() {
    return await this.aboutService.aboutInfo()
  }
 


}
