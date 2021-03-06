import { Body, Controller, Get, HttpCode, Patch, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Auth } from '~/common/decorator/auth.decorator';
import { CurrentUser } from '~/common/decorator/current-user.decorator';
import { IpLocation, IpRecord } from '~/common/decorator/ip.decorator';
import { ApiName } from '~/common/decorator/openapi.decorator';
import { getAvatar } from '~/utils/tool.util';
import { AuthService } from '../auth/auth.service';
import { userType } from './interface/user.interface';
import { LoginDto, UserDto, UserPatchDto } from './user.dto';
import { UserService } from './user.service';

@ApiName
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,
    private readonly authService: AuthService,
    ) { }


  @Post('register')
  @ApiOperation({ summary: '注册' })
  async register(@Body() userDto: UserDto) {
    return await this.userService.createUser(userDto)
  }


  @Post('login')
  @ApiOperation({ summary: '登录' })
  @HttpCode(200)
  async login(@Body() dto: LoginDto, @IpLocation() ipLocation: IpRecord) {
    const user = await this.userService.login(dto.username, dto.password)
    const footstep = await this.userService.recordFootstep(ipLocation.ip)
    const { username, created, url, mail, id } = user
    const avatar = user.avatar ?? getAvatar(mail)
    return {
      token: await this.authService.signToken(user.id),
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

  @Get()
  @ApiOperation({
    summary:'获取用户基本信息',
  })
  async getUserInfo() {
    return this.userService.getUserInfo()
  }

  @Get('/all')
  @ApiOperation({
    summary:'获取用户全部信息',
  })
  @Auth()
  async getUserInfoAll() {
    return this.userService.getUserInfoAll()
  }
  
  @Get('check_logged')
  @ApiOperation({ summary: '判断当前 Token 是否有效 ' })
  @Auth()
  checkLogged() {
    return 'ok'
  }

  @Get('init')
  @ApiOperation({ summary: '判断是否初始化完成' })
  async checkInit() {
    return {
      is_init: await this.userService.hasMaster(),
    }
  }

  @Patch()
  @ApiOperation({ summary: '修改主人的信息' })
  @Auth()
  async patchMasterData(
    @Body() body: UserPatchDto,
    @CurrentUser() user: userType,
  ) {
    return await this.userService.patchUserData(user, body)
  }


}
