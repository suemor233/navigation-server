import { Injectable, NotFoundException, NotImplementedException, UnsupportedMediaTypeException } from '@nestjs/common';
import { PrismaService } from '~/processors/database/database.service';
import { SocketGateway } from '~/processors/gateway/ws.gateway';
import { AboutModel } from './about.dto';

@Injectable()
export class AboutService {

  constructor(
    private prisma: PrismaService,
    private readonly ws: SocketGateway,
  ) { }

  async createAbout(about: AboutModel[]) {
    about.map(item => {
      if (!item.key && !item.value) {
        throw new NotFoundException('输入不能为空')
      }
    })

    try {
      await this.prisma.$transaction(async (prisma) => {
        await prisma.about.deleteMany({})
        await prisma.about.createMany({
          data: about
        })
      })
    } catch (error) {
      throw new NotImplementedException('名称不能重复')
    }

    this.ws.server.emit('user-about', await this.aboutInfo())
    return await this.aboutInfo()
  }

  async aboutInfo() {
    return this.prisma.about.findMany({})
  }
}
