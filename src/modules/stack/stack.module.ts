import { Module } from '@nestjs/common';
import { StackService } from './stack.service';
import { StackController } from './stack.controller';
import { SocketModule } from '~/processors/gateway/ws.module';

@Module({
  controllers: [StackController],
  providers: [StackService],
  imports: [SocketModule],
  exports:[StackService]
})
export class StackModule {}
