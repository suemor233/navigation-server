import { Controller, Get, Param } from '@nestjs/common';
import { ApiName } from '~/common/decorator/openapi.decorator';
import { IpDto } from './tool.dto';
import { ToolService } from './tool.service';

@Controller('tool')
@ApiName
export class ToolController {
  constructor(private readonly toolService: ToolService) {}

  @Get('/ip/:ip')
  async getIpInfo(@Param() params: IpDto) {
    const { ip } = params


    const result = await this.toolService.getIp(ip)

    return result
  } 
}
