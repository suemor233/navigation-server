import { SocketGateway } from './../../processors/gateway/ws.gateway';
import { BadRequestException, ForbiddenException, Injectable, Logger, UnprocessableEntityException, Delete } from '@nestjs/common';
import { MasterLostException } from '~/common/exceptions/master-lost.exception';
import { nanoid } from 'nanoid'
import { LoginDto, UserDto, UserPatchDto } from './user.dto';
import { PrismaService } from '~/processors/database/database.service';
import { hashSync } from 'bcrypt'
import { getAvatar, sleep } from '~/utils/tool.util';
import { compareSync } from 'bcrypt'
import { userType } from './interface/user.interface';
import { CacheService } from '~/processors/cache/cache.service';
import { getRedisKey } from '~/utils/redis.util';
import { RedisKeys } from '~/constants/cache.constant';
@Injectable()
export class UserService {
  private Logger = new Logger(UserService.name)
  constructor(
    private prisma: PrismaService,
    private readonly ws: SocketGateway,
    private readonly redis: CacheService,
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

    // save to redis
    process.nextTick(async () => {
      const redisClient = this.redis.getClient()
      await redisClient.sadd(
        getRedisKey(RedisKeys.LoginRecord),
        JSON.stringify({ date: new Date().toISOString(), ip }),
      )
    })

    this.Logger.warn(`主人已登录, IP: ${ip}`)

    return PrevFootstep as any
  }

  async getUserInfo() {
    const userCache = await this.getUserCache()
    if (userCache && Object.keys(userCache).length > 0) {
      return userCache
    } else {
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
          backgroundImage: true,
          socialIds: {
            select: {
              key: true,
              value: true
            }
          }
        },

      })
      if (!user) {
        throw new BadRequestException('没有完成初始化!')
      }
      const avatar = user.avatar ?? getAvatar(user.mail)
      const userWrapper = { ...user, avatar }
      this.setUserCache(userWrapper)
      return userWrapper
    }

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
    if (doc.socialIds) {
      const _key = []
      doc.socialIds.map(item => {
        if (_key.indexOf(item.key) === -1) {
          _key.push(item.key)
        } else {
          throw new UnprocessableEntityException('不能有重复的社交链接')
        }
      })
      await this.prisma.socialIds.deleteMany({})
      await this.prisma.user.update({
        where: {
          id: user.id
        },
        data: {
          socialIds: {
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
    await this.deleteUserCache()
    this.ws.server.emit('user-update', await this.getUserInfo())
    return res

  }


  async setUserCache(user: any) {
    return await this.redis.set(RedisKeys.User, user)
  }

  async getUserCache() {
    return await this.redis.get(RedisKeys.User)
  }

  async deleteUserCache() {
    return this.redis.getClient().del(RedisKeys.User)
  }

  async hasMaster() {
    return !!(await this.prisma.user.count())
  }
}
