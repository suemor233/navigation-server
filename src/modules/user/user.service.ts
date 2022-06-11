import { SocketGateway } from './../../processors/gateway/ws.gateway';
import { BadRequestException, ForbiddenException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from '~/transformers/model.transformer'
import { getAvatar, sleep } from '~/utils/tool.util';
import { UserDocument, UserModel } from './user.model';
import { compareSync } from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { MasterLostException } from '~/common/exceptions/master-lost.exception';
import { nanoid } from 'nanoid'
import { UserPatchDto } from './user.dto';

@Injectable()
export class UserService {


  constructor(
    @InjectModel(UserModel)
    private readonly userModel: ReturnModelType<typeof UserModel>,
    private readonly jwtService: JwtService,
    private readonly ws: SocketGateway,
  ) { }
  async createUser(model: Pick<UserModel, 'username' | 'password'>) {
    const hasMaster = await this.hasMaster()
    // 禁止注册两个以上账户
    if (hasMaster) {
      throw new BadRequestException('我已经有一个主人了哦')
    }

    const authCode = nanoid(10)
    const res = await this.userModel.create({ ...model, authCode })
    return { username: res.username, authCode: res.authCode }
  }


  async login(username: string, password: string) {
    const user = await this.userModel.findOne({ username }).select('+password')
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
    const master = await this.userModel.findOne()
    if (!master) {
      throw new MasterLostException()
    }
    const PrevFootstep = {
      lastLoginTime: master.lastLoginTime || new Date(1586090559569),
      lastLoginIp: master.lastLoginIp || null,
    }
    await master.updateOne({
      lastLoginTime: new Date(),
      lastLoginIp: ip,
    })

    return PrevFootstep as any
  }

  async getUserInfo() {
    const user = await this.userModel
      .findOne()
      .select('-authCode +lastLoginIp')
      .lean({ virtuals: true })
    if (!user) {
      throw new BadRequestException('没有完成初始化!')
    }
    const avatar = user.avatar ?? getAvatar(user.mail)
    return { ...user, avatar }
  }


  async patchUserData(user: UserDocument, data: Partial<UserModel>) {
    const { password } = data
    const doc = { ...data }
    if (password !== undefined) {
      const { _id } = user
      const currentUser = await this.userModel
        .findById(_id)
        .select('+password +apiToken')

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
    }
    const res = await this.userModel.updateOne({ _id: user._id }, doc)
    this.ws.server.emit('user-update',await this.getUserInfo())
    return res

  }



  async hasMaster() {
    return !!(await this.userModel.countDocuments())
  }
}
