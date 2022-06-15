import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Auth } from '~/common/decorator/auth.decorator';
import { ApiName } from '~/common/decorator/openapi.decorator';
import { ProjectModel } from './project.dto';
import { ProjectService } from './project.service';

@ApiName
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @Auth()
  @ApiOperation({ summary: '创建项目' })
  async create(@Body() project: ProjectModel) {
    return await this.projectService.createProject(project)
  }
 

  @Get()
  @ApiOperation({ summary: '获取项目列表' })
  async findProject(@Query('pageNum') pageNum:number,@Query('pageSize')pageSize:number) {
    return await this.projectService.findProject(pageNum,pageSize);
  }


  @Delete()
  @ApiOperation({ summary: '删除项目' })
  @Auth()
  async deletePosts(@Body()ids:string[]) {
    return this.projectService.deleteProject(ids)
  }
 
}
