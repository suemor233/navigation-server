import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from '~/transformers/model.transformer'
import { UserDto } from './user.dto';
import { UserModel } from './user.model';


@Injectable()
export class UserService {

  constructor(
    @InjectModel(UserModel)
    private readonly userModel: ReturnModelType<typeof UserModel>,

  ) {}
  async createUser(userDto: UserDto) {
     const res =  await this.userModel.create(userDto)
     return res
  }
 
}
