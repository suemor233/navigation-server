import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { machineIdSync } from 'node-machine-id'
import { SECURITY } from '~/app.config';
import { isDev } from '~/global/env.global';
import { JwtModule } from '@nestjs/jwt';

const getMachineId = () => {
  const id = machineIdSync()

  return id
}
export const __secret: any =
  SECURITY.jwtSecret ||
  Buffer.from(getMachineId()).toString('base64').slice(0, 15) ||
  'asjhczxiucipoiopiqm2376'
if (isDev ) {
  console.log(__secret)
}

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
  controllers: [UserController],
  providers: [UserService],
  imports: [jwtModule],
  exports: [UserService,jwtModule],
})
export class UserModule {}
