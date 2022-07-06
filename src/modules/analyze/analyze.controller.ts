import { Controller, Delete, Get, HttpCode, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Auth } from '~/common/decorator/auth.decorator';
import { ApiName } from '~/common/decorator/openapi.decorator';
import { AnalyzeService } from './analyze.service';

@Controller('analyze')
@ApiName
// @Auth()
export class AnalyzeController {
  constructor(private readonly analyzeService: AnalyzeService) {}

  @Get()
  @ApiOperation({ summary: '获取分析日志' })
  async findProject(@Query('pageNum') pageNum = 1,@Query('pageSize')pageSize = 50) {
    return await this.analyzeService.findAnalyze(Number(pageNum),Number(pageSize));
  }

  @Get('/aggregate')
  async getFragment() {
    return await this.analyzeService.getPvAggregate();
  }
  

  @Delete('/')
  async clearAnalyze() {
    return await this.analyzeService.clearAnalyze();
  }
}

