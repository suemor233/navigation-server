import { Injectable, NotFoundException, NotImplementedException, UnsupportedMediaTypeException } from '@nestjs/common';
import { PrismaService } from '~/processors/database/database.service';
import { SocketGateway } from '~/processors/gateway/ws.gateway';
import { StackModel } from './stack.dto';

@Injectable()
export class StackService {

  constructor(
    private prisma: PrismaService,
    private readonly ws: SocketGateway,
  ) { }

  async createStack(stack: StackModel[]) {
    if (stack.length === 0) {
      return await this.prisma.stack.deleteMany({})
    } else {
      stack.map(item => {
        if (!item.name && !item.progressValue) {
          throw new NotFoundException('输入不能为空')
        }
      })

      try {
        await this.prisma.$transaction(async (prisma) => {
          await prisma.stack.deleteMany({})
          await prisma.stack.createMany({
            data: stack
          })
        })
      } catch (error) {
        throw new NotImplementedException('名称不能重复')
      }

      this.ws.server.emit('user-stack', await this.StackInfo())
      return await this.StackInfo()
    }

  }

  async StackInfo() {
    return this.prisma.stack.findMany({})
  }
}
