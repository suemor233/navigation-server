import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard as _AuthGuard } from '@nestjs/passport'

import { isTest } from '~/global/env.global'
import { getNestExecutionContextRequest } from '~/transformers/get-req.transformer'

/**
 * JWT auth guard
 */

@Injectable()
export class AuthGuard extends _AuthGuard('jwt') implements CanActivate {
  override async canActivate(context: ExecutionContext): Promise<any> {
    const request = this.getRequest(context)

    if (typeof request.user !== 'undefined') {
      return true
    }


    return super.canActivate(context) as any
  }

  getRequest(context: ExecutionContext) {
    return getNestExecutionContextRequest(context)
  }
}
