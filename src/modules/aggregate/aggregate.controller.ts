import { Controller, Get } from '@nestjs/common'

import { Auth } from '~/common/decorator/auth.decorator'
import { ApiName } from '~/common/decorator/openapi.decorator'

import { AboutService } from '../about/about.service'
import { ProjectService } from '../project/project.service'
import { StackService } from '../stack/stack.service'
import { UserService } from '../user/user.service'
import { AggregateService } from './aggregate.service'

@Controller('aggregate')
@ApiName
export class AggregateController {
  constructor(
    private readonly userService: UserService,
    private readonly aggregateService: AggregateService,
    private readonly aboutService: AboutService,
    private readonly projectService: ProjectService,
    private readonly StackService: StackService,
  ) {}

  @Get('/')
  async aggregate() {
    const tasks = await Promise.allSettled([
      this.userService.getUserInfo(),
      this.aboutService.basicInfo(),
      this.aboutService.findDetail(),
      this.projectService.findProject(),
      this.StackService.StackInfo(),
    ])

    const [user, aboutBasic, aboutDetail, project, stack] = tasks.map((t) => {
      if (t.status === 'fulfilled') {
        return t.value
      } else {
        return null
      }
    })
    return {
      user,
      aboutBasic,
      aboutDetail,
      project,
      stack,
    }
  }

  @Get('/stat')
  @Auth()
  async Stat() {
    return this.aggregateService.getCounts()
  }
}
