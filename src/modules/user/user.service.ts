import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from '~/transformers/model.transformer'
import { sleep } from '~/utils/tool.util';
import { UserModel } from './user.model';
import { compareSync } from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { MasterLostException } from '~/common/exceptions/master-lost.exception';
import { nanoid } from 'nanoid'

@Injectable()
export class UserService {



  constructor(
    @InjectModel(UserModel)
    private readonly userModel: ReturnModelType<typeof UserModel>,
    private readonly jwtService: JwtService,
  ) {}
  async createUser(model: Pick<UserModel,'username' | 'password'>) {
    const hasMaster = await this.hasMaster()
    // 禁止注册两个以上账户
    if (hasMaster) {
      throw new BadRequestException('我已经有一个主人了哦')
    }

    const authCode = nanoid(10)
    const res = await this.userModel.create({...model,authCode})
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
  


   async hasMaster() {
    return !!(await this.userModel.countDocuments())
  }
}
