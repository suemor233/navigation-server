import { Injectable } from '@nestjs/common';
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
    await this.prisma.about.deleteMany({});
    return await this.prisma.about.createMany({
      data: about
    })
  }
}
