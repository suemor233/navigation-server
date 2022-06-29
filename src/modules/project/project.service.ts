import { BadRequestException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '~/processors/database/database.service';
import { SocketGateway } from '~/processors/gateway/ws.gateway';
import { ProjectModel } from './project.dto';

@Injectable()
export class ProjectService {
  constructor(
    private prisma: PrismaService,
    private readonly ws: SocketGateway,
  ) {}

  async createProject(project: ProjectModel) {
    const _project = await this.prisma.project.create({
      data: project,
    });
    this.emitProjectSocket();
    return _project;
  }

  async findProject(pageNum?: number, pageSize?: number) {
    if (pageNum && pageSize) {
      const itemCount = await this.prisma.project.count() || 1;
      const project = await this.prisma.project.findMany({
        orderBy: { created: 'desc' },
        skip: (pageNum - 1) * pageSize,
        take: pageSize,
      });
      const projectList = {
        pagination: {
          pageCount: Math.ceil(itemCount / pageSize),
          page: pageNum,
          pageSize,
          itemCount,
        },
        project,
      };
      return projectList;
    } else {
      const project = await this.prisma.project.findMany({
        orderBy: { created: 'desc' },
      });
      return project;
    }
  }

  findProjectById(id: string) {
    const currentProject = this.prisma.project.findFirst({
      where: {
        id,
      },
    });

    if (!currentProject) {
      throw new BadRequestException('项目不存在');
    }
    return currentProject;
  }

  async deleteProject(ids: string[]) {
    const _deleteProject = await this.prisma.project.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    this.emitProjectSocket();

    return _deleteProject;
  }

  async patchProject(id: string, project: ProjectModel) {
    this.findProjectById(id);
    const _patchProject = await this.prisma.project.update({
      where: { id },
      data: {
        ...project,
      },
    });
    this.emitProjectSocket();
    return _patchProject;
  }

  async emitProjectSocket() {
    this.ws.server.emit('user-project', await this.findProject());
  }
}
