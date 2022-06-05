import { hashSync } from 'bcrypt'
import { Schema } from 'mongoose'

import {
  DocumentType,
  Severity,
  modelOptions,
  prop,
} from '@typegoose/typegoose'

import { BaseModel } from '~/shared/model/base.model'

export type UserDocument = DocumentType<UserModel>

export class OAuthModel {
  @prop()
  platform: string
  @prop()
  id: string
}

export class TokenModel {
  @prop()
  created: Date

  @prop()
  token: string

  @prop()
  expired?: Date

  @prop({ unique: true })
  name: string
}

@modelOptions({ options: { customName: 'User', allowMixed: Severity.ALLOW } })
export class UserModel extends BaseModel {
  @prop({ required: true, unique: true, trim: true })
  username!: string

  @prop({ trim: true })
  name!: string

  
}
