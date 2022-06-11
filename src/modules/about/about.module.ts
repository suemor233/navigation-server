import { Module } from '@nestjs/common';
import { AboutService } from './about.service';
import { AboutController } from './about.controller';
import { SocketModule } from '~/processors/gateway/ws.module';

@Module({
  controllers: [AboutController],
  providers: [AboutService],
  imports: [SocketModule]
})
export class AboutModule {}
