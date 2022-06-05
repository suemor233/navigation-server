import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { UserDto } from './user.dto';
import { UserService } from './user.service';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('register')
  @ApiOperation({ summary: '注册' })
  async register(@Body() userDto: UserDto) {

    return await this.userService.createUser(userDto)
  }

}
