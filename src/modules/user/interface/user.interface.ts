export interface userType {
  id?: string,
  username?: string,
  password?: string,
  introduce?: string,
  avatar?: string,
  mail?: string,
  url?: string,
  lastLoginTime?: Date,
  lastLoginIp?: string,
  backgroundImage?: string,
  socialIds?: {key:string,value:string}[]

}