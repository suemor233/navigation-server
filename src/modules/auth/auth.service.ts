import { Injectable } from '@nestjs/common';
import { InjectModel } from '~/transformers/model.transformer';
import {
  TokenModel,
  UserModel as User,
  UserDocument,
  UserModel,
} from '~/modules/user/user.model'
import { ReturnModelType } from '@typegoose/typegoose';
import { JwtService } from '@nestjs/jwt';
import { MasterLostException } from '~/common/exceptions/master-lost.exception';
import { JwtPayload } from './interfaces/jwt-payload.interface';
@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User) private readonly userModel: ReturnModelType<typeof User>,
    private readonly jwtService: JwtService,
  ) {}

  async signToken(_id: string) {
    const user = await this.userModel.findById(_id).select('authCode')
    if (!user) {
      throw new MasterLostException()
    }
    const authCode = user.authCode
    const payload = {
      _id,
      authCode,
    }

    return this.jwtService.sign(payload)
  }

  async verifyPayload(payload: JwtPayload): Promise<UserDocument | null> {
    const user = await this.userModel.findById(payload._id).select('+authCode')

    if (!user) {
      throw new MasterLostException()
    }

    return user && user.authCode === payload.authCode ? user : null
  }
}
