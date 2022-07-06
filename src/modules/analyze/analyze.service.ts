import { Injectable } from '@nestjs/common';
import { PrismaService } from '~/processors/database/database.service';
import dayjs from 'dayjs';

@Injectable()
export class AnalyzeService {
  constructor(private prisma: PrismaService) {}

  async findAnalyze(pageNum: number, pageSize: number) {
    const itemCount = (await this.prisma.analyzes.count()) || 1;
    const analyzes = await this.prisma.analyzes.findMany({
      orderBy: { created: 'desc' },
      skip: (pageNum - 1) * pageSize,
      take: Number(pageSize),
    });
    return {
      analyzes,
      pagination: {
        pageCount: Math.ceil(itemCount / pageSize),
        page: pageNum,
        pageSize,
        itemCount,
      },
    };
  }

  async clearAnalyze() {
    return await this.prisma.analyzes.deleteMany({});
  }

  async getPvAggregate() {
    const now = dayjs();
    const beforeDawn = now.set('minute', 0).set('second', 0).set('hour', 0);
    let cond = beforeDawn.toDate();
    const time = await this.prisma.analyzes.findMany({
      where: {
        created: {
          gte: cond,
        },
      },
    });

    const dayData = Array(24)
      .fill(undefined)
      .map((v, i) => {
        return {
          hour: `${i}时`,
          key: 'pv',
          value:  0,
        }
      })

    time.map((item) => {
      dayData[item.created.getHours()].value++
    });
    return dayData;
  }
}
