import { SocketGateway } from './../../processors/gateway/ws.gateway';
import { BadRequestException, ForbiddenException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { MasterLostException } from '~/common/exceptions/master-lost.exception';
import { nanoid } from 'nanoid'
import { LoginDto, UserDto, UserPatchDto } from './user.dto';
import { PrismaService } from '~/processors/database/database.service';
import { hashSync } from 'bcrypt'
import { getAvatar, sleep } from '~/utils/tool.util';
import { compareSync } from 'bcrypt'
import { userType } from './interface/user.interface';
@Injectable()
export class UserService {


  constructor(
    private prisma: PrismaService,
    private readonly ws: SocketGateway,
  ) { }
  async createUser(model: Pick<UserDto, 'username' | 'password'>) {

    const hasMaster = await this.hasMaster()

    // 禁止注册两个以上账户
    if (hasMaster) {
      throw new BadRequestException('我已经有一个主人了哦')
    }
    model.password = hashSync(model.password, 6)

    const authCode = nanoid(10)
    const res = await this.prisma.user.create({
      data: {
        ...model, authCode
      }
    })
    return { username: res.username, authCode: res.authCode }
  }


  async login(username: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        username
      },
    })
    if (!user) {
      await sleep(1000)
      throw new ForbiddenException('用户名不正确')
    }
    if (!compareSync(password, user.password)) {
      await sleep(1000)
      throw new ForbiddenException('密码不正确')
    }

    return user
  }


  /**
 * 记录登陆的足迹(ip, 时间)
 *
 * @async
 * @param {string} ip - string
 * @return {Promise<Record<string, Date|string>>} 返回上次足迹
 */
  async recordFootstep(ip: string): Promise<Record<string, Date | string>> {
    const master = await this.prisma.user.findFirst()
    if (!master) {
      throw new MasterLostException()
    }
    const PrevFootstep = {
      lastLoginTime: master.lastLoginTime || new Date(1586090559569),
      lastLoginIp: master.lastLoginIp || null,
    }
    await this.prisma.user.update({
      where: {
        username: master.username
      },
      data: {
        lastLoginTime: new Date(),
        lastLoginIp: ip,
      }
    }
    )

    return PrevFootstep as any
  }

  async getUserInfo() {
    const user = await this.prisma.user.findFirst({
      select: {
        id: true,
        username: true,
        introduce: true,
        avatar: true,
        mail: true,
        url: true,
        lastLoginTime: true,
        lastLoginIp: true,
        socialIds: {
          select: {
           key:true,
           value:true
          }
        }
      },
      
    })
    if (!user) {
      throw new BadRequestException('没有完成初始化!')
    }
    const avatar = user.avatar ?? getAvatar(user.mail)
    return { ...user, avatar }
  }


  async patchUserData(user: userType, data: UserPatchDto) {
    const { password } = data
    const doc = { ...data }
    if (password !== undefined) {
      const { id } = user
      const currentUser = await this.prisma.user
        .findFirst({ where: { id } })


      if (!currentUser) {
        throw new MasterLostException()
      }

      // 1. 验证新旧密码是否一致
      const isSamePassword = compareSync(password, currentUser.password)
      if (isSamePassword) {
        throw new UnprocessableEntityException('密码可不能和原来的一样哦')
      }

      // 2. 认证码重新生成
      const newCode = nanoid(10)
      doc.authCode = newCode
      doc.password = hashSync(doc.password, 6)
    }
    if (doc.socialIds &&  Object.keys(doc.socialIds).length > 0) {
      await this.prisma.socialIds.deleteMany({})
      await this.prisma.user.update({
        where: {
          id: user.id
        },
        data:{
          socialIds:{
            create: doc.socialIds
          }
        }
      
      })
    }
    delete doc.socialIds
    await this.prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        ...doc
      }
    })

    const res = await this.getUserInfo()
    this.ws.server.emit('user-update', await this.getUserInfo())
    return res

  }



  async hasMaster() {
    return !!(await this.prisma.user.count())
  }
}
