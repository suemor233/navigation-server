import { Controller, Scope } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller({
  path: 'auth',
  scope: Scope.REQUEST,
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}
}
