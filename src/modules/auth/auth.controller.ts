import { Controller, Get, Scope } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Auth } from '~/common/decorator/auth.decorator';
import { ApiName } from '~/common/decorator/openapi.decorator';
import { AuthService } from './auth.service';

@Controller({
  path: 'auth',
  scope: Scope.REQUEST,
})
@ApiName
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Get('check_logged')
  @ApiOperation({ summary: '判断当前 Token 是否有效 ' })
  @Auth()
  checkLogged(isMaster: boolean) {
    return 'ok'
  }
}
