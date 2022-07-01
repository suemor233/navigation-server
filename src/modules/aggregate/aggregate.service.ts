import { Injectable } from '@nestjs/common';
import { PrismaService } from '~/processors/database/database.service';

@Injectable()
export class AggregateService {
  constructor(private prisma: PrismaService) {}

  async getCounts() {
    const [aboutBasic,aboutDetail,project,stack,socialIds] = await Promise.all([
      this.prisma.aboutBasic.count(),
      this.prisma.aboutDetail.count(),
      this.prisma.project.count(),
      this.prisma.stack.count(),
      this.prisma.socialIds.count(),
    ])
    return {
      aboutBasic,
      aboutDetail,
      project,
      stack,
      socialIds
    }
  }
}
