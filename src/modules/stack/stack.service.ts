import { Injectable, NotFoundException, NotImplementedException, UnsupportedMediaTypeException } from '@nestjs/common';
import { RedisKeys } from '~/constants/cache.constant';
import { CacheService } from '~/processors/cache/cache.service';
import { PrismaService } from '~/processors/database/database.service';
import { SocketGateway } from '~/processors/gateway/ws.gateway';
import { getRedisKey } from '~/utils/redis.util';
import { StackModel } from './stack.dto';

@Injectable()
export class StackService {

  constructor(
    private prisma: PrismaService,
    private readonly ws: SocketGateway,
    private readonly redis: CacheService,
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

      
      await this.redis.set(getRedisKey(RedisKeys.Stack), stack)
      this.ws.server.emit('user-stack', await this.StackInfo())
      return await this.StackInfo()
    }

  }

  async StackInfo() {

    const cacheStack = await this.getStackCache()
    if (cacheStack && Object.keys(cacheStack).length > 0) {
      return cacheStack
    } else {
      const stack = await this.prisma.stack.findMany({})
      await this.redis.set(getRedisKey(RedisKeys.Stack), stack)
      return stack
    }
  }

  async getStackCache() {
    return await this.redis.get(getRedisKey(RedisKeys.Stack))
  }
}
