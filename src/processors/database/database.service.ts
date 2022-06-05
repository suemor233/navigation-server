import { Inject, Injectable } from '@nestjs/common'
import { ReturnModelType, mongoose } from '@typegoose/typegoose'

import { DB_CONNECTION_TOKEN } from '../../constants/system.constant'


@Injectable()
export class DatabaseService {
  constructor(

    @Inject(DB_CONNECTION_TOKEN) private connection: mongoose.Connection,
  ) {}




  public get db() {
    return this.connection.db
  }
}
