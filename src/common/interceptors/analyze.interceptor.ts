/**
 * Analyze interceptor.
 * @file 数据分析拦截器
 * @module interceptor/analyze
 * @author Innei <https://github.com/Innei>
 */
import isbot from 'isbot';
import { Observable } from 'rxjs';
import UAParser from 'ua-parser-js';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { getNestExecutionContextRequest } from '~/transformers/get-req.transformer';
import { getIp } from '~/utils/ip.util';
import { PrismaService } from '~/processors/database/database.service';
import { isDev } from '~/global/env.global';

@Injectable()
export class AnalyzeInterceptor implements NestInterceptor {
  private parser: UAParser;

  constructor(private prisma: PrismaService) {
    this.init();
  }

  async init() {
    this.parser = new UAParser();
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const call$ = next.handle();
    const request = getNestExecutionContextRequest(context);
    if (!request) {
      return call$;
    }
    const method = request.method.toUpperCase();
    if (method !== 'GET') {
      return call$;
    }
    const ip = getIp(request);

    if (!isDev){
      // if req from SSR server, like 127.0.0.1, skip
      if (['127.0.0.1', 'localhost', '::-1'].includes(ip)) {
        return call$;
      }
      // if login
      if (request.user) {
        return call$;
      }
    }


    // if user agent is in bot list, skip
    if (isbot(request.headers['user-agent'])) {
      return call$;
    }

    const url = request.url.replace(/^\/api(\/v\d)?/, '');

    if (url.startsWith('/proxy')) {
      return call$;
    }

    process.nextTick(async () => {
      try {
        request.headers['user-agent'] &&
          this.parser.setUA(request.headers['user-agent']);

        const ua = this.parser.getResult();
        await this.prisma.analyzes.create({
          data: {
            ip,
            path: new URL(`http://a.com${url}`).pathname,
            browser: ua.browser.name + ' ' + ua.browser.version,
            os: ua.os.name + ' ' + ua.os.version,
            ua: ua.ua,
          },
        });
      } catch (e) {
        console.error(e);
      }
    });

    return call$;
  }
}
