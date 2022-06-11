import { Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { MasterLostException } from '~/common/exceptions/master-lost.exception';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { PrismaService } from '~/processors/database/database.service';
@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async signToken(id: string) {
    const user = await this.prisma.user.findFirst({
      where:{
        id
      }
    })
    if (!user) {
      throw new MasterLostException()
    }
    const authCode = user.authCode
    const payload = {
      id,
      authCode,
    }

    return this.jwtService.sign(payload)
  }

  async verifyPayload(payload: JwtPayload) {
    const user = await this.prisma.user.findFirst({
      where:{
        id:payload._id
      }
    })

    if (!user) {
      throw new MasterLostException()
    }

    return user && user.authCode === payload.authCode ? user : null
  }
}
