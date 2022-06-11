// import { Body, Controller, Post } from '@nestjs/common';
// import { ApiOperation } from '@nestjs/swagger';
// import { ApiName } from '~/common/decorator/openapi.decorator';
// import { AboutModel } from './about.model';
// import { AboutService } from './about.service';

// @ApiName
// @Controller('about')
// export class AboutController {
//   constructor(private readonly aboutService: AboutService) {}

//   @Post()
//   @ApiOperation({ summary: '添加基本介绍' })
//   async create(@Body() about: AboutModel) {
//     return await this.aboutService.createAbout(about )
//   }
 
// }
