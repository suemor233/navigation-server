import { Global, Module } from '@nestjs/common'
import { PrismaService } from './database.service';


@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
@Global()
export class DatabaseModule {}
