import { Global, Module, Provider, forwardRef } from '@nestjs/common'


import { AggregateModule } from '~/modules/aggregate/aggregate.module'
import { HttpService } from './helper.http.service'


const providers: Provider<any>[] = [

  HttpService,

]

@Module({
  imports: [
    forwardRef(() => AggregateModule),
  ],
  providers,
  exports: providers,
})
@Global()
export class HelperModule {}
