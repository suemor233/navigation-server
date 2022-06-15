import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { SocketModule } from './../../processors/gateway/ws.module';
@Module({
  controllers: [ProjectController],
  providers: [ProjectService],
  imports: [SocketModule]
})
export class ProjectModule {}
