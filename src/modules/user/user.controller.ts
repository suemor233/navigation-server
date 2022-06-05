import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { IpLocation, IpRecord } from '~/common/decorator/ip.decorator';
import { ApiName } from '~/common/decorator/openapi.decorator';
import { getAvatar } from '~/utils/tool.util';
import { LoginDto, UserDto } from './user.dto';
import { UserModel } from './user.model';
import { UserService } from './user.service';

@ApiName
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Post('register')
  @ApiOperation({ summary: '注册' })
  async register(@Body() userDto: UserDto) {
    return await this.userService.createUser(userDto as UserModel)
  }


  @Post('login')
  @ApiOperation({ summary: '登录' })
  @HttpCode(200)
  async login(@Body() dto: LoginDto, @IpLocation() ipLocation: IpRecord) {
    const user =  await this.userService.login(dto.username, dto.password)
    const footstep =  await this.userService.recordFootstep(ipLocation.ip)
    const { username, created, url, mail, id } = user
    const avatar = user.avatar ?? getAvatar(mail)
    return {
      token: await this.userService.signToken(user._id),
      ...footstep,
      username,
      created,
      url,
      mail,
      avatar,
      expiresIn: 7,
      id,
    }
  }

}
