import {
  BadRequestException,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { RedisKeys } from '~/constants/cache.constant';
import { CacheService } from '~/processors/cache/cache.service';
import { PrismaService } from '~/processors/database/database.service';
import { SocketGateway } from '~/processors/gateway/ws.gateway';
import { getRedisKey } from '~/utils/redis.util';
import { DetailModel, BasicModel } from './about.dto';

@Injectable()
export class AboutService {
  constructor(
    private prisma: PrismaService,
    private readonly ws: SocketGateway,
    private readonly redis: CacheService,
  ) {}

  async createBasic(about: BasicModel[]) {
    about.map((item) => {
      if (!item.key && !item.value) {
        throw new NotFoundException('输入不能为空');
      }
    });

    try {
      await this.prisma.$transaction(async (prisma) => {
        await prisma.aboutBasic.deleteMany({});
        await prisma.aboutBasic.createMany({
          data: about,
        });
      });
    } catch (error) {
      throw new NotImplementedException('名称不能重复');
    }

    await this.redis.getClient().del(getRedisKey(RedisKeys.About));
    this.ws.server.emit('user-about', await this.basicInfo());
    return await this.basicInfo();
  }

  async basicInfo() {
    const cacheAbout = await this.getAboutCache();
    if (cacheAbout && Object.keys(cacheAbout).length > 0) {
      return cacheAbout;
    } else {
      const about = await this.prisma.aboutBasic.findMany({});
      await this.redis.set(getRedisKey(RedisKeys.About), about);
      return about;
    }
  }

  async getAboutCache() {
    return await this.redis.get(getRedisKey(RedisKeys.About));
  }

  createDetail(about: DetailModel) {
    const createAbout = this.prisma.aboutDetail.create({
      data: about,
    });
    this.emitDetailSocket();
    return createAbout;
  }

  async findDetail(pageNum?: number, pageSize?: number) {
    if (pageNum && pageSize) {
      const itemCount = await this.prisma.aboutDetail.count() || 1;
      const aboutDetail = await this.prisma.aboutDetail.findMany({
        orderBy: { created: 'desc' },
        skip: (pageNum - 1) * pageSize,
        take: pageSize,
      });
      const aboutDetailList = {
        pagination: {
          pageCount: Math.ceil(itemCount / pageSize),
          page: pageNum,
          pageSize,
          itemCount,
        },
        aboutDetail,
      };
      return aboutDetailList;
    } else {
      const aboutDetail = await this.prisma.aboutDetail.findMany({
        orderBy: { created: 'desc' },
      });
      return aboutDetail;
    }
  }

  async deleteDetail(ids: string[]) {
    const  _deleteDetail =  await this.prisma.aboutDetail.deleteMany({
      where: {
        id: {
          in: ids
        }
      }
    })
    this.emitDetailSocket()
    return _deleteDetail
  }
  patchDetail(id: string, aboutDetail: DetailModel) {
    this.findDetailById(id)
    const _patchDetail = this.prisma.aboutDetail.update({
      where: { id },
      data: {
        ...aboutDetail
      }
    })
    this.emitDetailSocket()
    return _patchDetail

  }
  findDetailById(id: string) {
    const currentDetail = this.prisma.aboutDetail.findFirst({
      where: {
        id
      }
    })

    if (!currentDetail) {
      throw new BadRequestException('项目不存在')
    }
    return currentDetail
  }

  async emitDetailSocket() {
    this.ws.server.emit('about-detail', await this.findDetail());
  }
}
