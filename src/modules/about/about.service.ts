import { Injectable, NotFoundException, NotImplementedException, UnsupportedMediaTypeException } from '@nestjs/common';
import { RedisKeys } from '~/constants/cache.constant';
import { CacheService } from '~/processors/cache/cache.service';
import { PrismaService } from '~/processors/database/database.service';
import { SocketGateway } from '~/processors/gateway/ws.gateway';
import { AboutModel } from './about.dto';

@Injectable()
export class AboutService {

  constructor(
    private prisma: PrismaService,
    private readonly ws: SocketGateway,
    private readonly redis: CacheService,
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

    await this.redis.set(RedisKeys.About, about)
    this.ws.server.emit('user-about', await this.aboutInfo())
    return await this.aboutInfo()
  }

  async aboutInfo() {
    const cacheAbout = await this.getAboutCache()
    if (cacheAbout && Object.keys(cacheAbout).length > 0  ) {
      return cacheAbout
    } else {
      const about = await this.prisma.about.findMany({})
      await this.redis.set(RedisKeys.About, about)
      return about
    }
  }

  async getAboutCache() {
    return await this.redis.get(RedisKeys.About)
  }
}
