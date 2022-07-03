import { Injectable } from '@nestjs/common';
import { PrismaService } from '~/processors/database/database.service';

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
}
