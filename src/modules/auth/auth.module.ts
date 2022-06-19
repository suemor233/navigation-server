import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SECURITY } from '~/app.config';
import { isDev } from '~/global/env.global';
import { machineIdSync } from 'node-machine-id';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from './jwt.strategy';

const getMachineId = () => {
  const id = machineIdSync()

  return id
}
export const __secret: any =
  SECURITY.jwtSecret ||
  Buffer.from(getMachineId()).toString('base64').slice(0, 15) ||
  'asjhczxiucipoiopiqm2376'

const jwtModule = JwtModule.registerAsync({
  useFactory() {
    return {
      secret: __secret,
      signOptions: {
        expiresIn: SECURITY.jwtExpire,
        algorithm: 'HS256',
      },
    }
  },
})
@Module({
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
  imports: [PassportModule,jwtModule],
  exports: [JwtStrategy,AuthService,jwtModule],
})
export class AuthModule {}
