import { UserModel } from '~/modules/user/user.model'
import { getProviderByTypegooseClass } from '~/transformers/model.transformer'

export const databaseModels = [
  UserModel
].map((model) => getProviderByTypegooseClass(model))
