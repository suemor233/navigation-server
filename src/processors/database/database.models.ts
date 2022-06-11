import { AboutModel } from './../../modules/about/about.model';
import { UserModel } from '~/modules/user/user.model'
import { getProviderByTypegooseClass } from '~/transformers/model.transformer'

export const databaseModels = [
  UserModel,
  AboutModel
].map((model) => getProviderByTypegooseClass(model))
