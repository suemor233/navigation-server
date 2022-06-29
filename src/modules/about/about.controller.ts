import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Auth } from '~/common/decorator/auth.decorator';
import { ApiName } from '~/common/decorator/openapi.decorator';
import { DetailModel, BasicModel } from './about.dto';
import { AboutService } from './about.service';

@ApiName
@Controller('about')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Post('basic')
  @Auth()
  @ApiOperation({ summary: '添加基本介绍' })
  async createBasic(@Body() about: BasicModel[]) {
    return await this.aboutService.createBasic(about);
  }

  @Get('basic')
  @ApiOperation({ summary: '获取基本介绍' })
  async basicInfo() {
    return await this.aboutService.basicInfo();
  }

  @Post('detail')
  @Auth()
  @ApiOperation({ summary: '创建简要介绍' })
  async createDetail(@Body() about: DetailModel) {
    return await this.aboutService.createDetail(about);
  }

  @Get('detail')
  @ApiOperation({ summary: '获取简要介绍列表' })
  async findDetail(@Query('pageNum') pageNum:number,@Query('pageSize')pageSize:number) {
    return await this.aboutService.findDetail(pageNum,pageSize)
  }

  @Get('/detail/:id')
  @ApiOperation({ summary: '根据 id 获取简要介绍' })
  async findProjectById(@Param('id') id: string) {
    return await this.aboutService.findDetailById(id);
  }

  @Put('/detail/:id')
  @Auth()
  @ApiOperation({ summary: '修改简要介绍' })
  async PatchProject(@Param('id') id: string, @Body() project: DetailModel) {
    return await this.aboutService.patchDetail(id, project);
  }

  @Delete('detail')
  @ApiOperation({ summary: '删除简要介绍' })
  @Auth()
  async deletePosts(@Body() ids: string[]) {
    return this.aboutService.deleteDetail(ids);
  }
}
