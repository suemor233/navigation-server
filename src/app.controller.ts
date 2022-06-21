import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import PKG from '../package.json'
import { Auth } from './common/decorator/auth.decorator';
import { CacheService } from './processors/cache/cache.service';
@Controller()
@ApiTags('Root')
export class AppController {
  constructor(private readonly cacheService: CacheService,) { }
  @Get(['/', '/info'])
  async appInfo() {
    return {
      name: PKG.name,
      author: PKG.author,
      version: PKG.version,
      homepage: PKG.homepage,
      issues: PKG.issues,
    }
  }

  @Get('/ping')
  ping(): 'pong' {
    return 'pong'
  }

  @Get('/clean_redis')
  @Auth()
  async cleanAllRedisKey() {
    await this.cacheService.cleanAllRedisKey()
    return 'ok'
  }
}
