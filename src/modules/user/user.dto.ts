import {
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { IsAllowedUrl } from '~/utils/validator/isAllowedUrl'

class UserOptionDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: '我是练习时长两年半的个人练习生' })
  readonly introduce?: string

  @ApiProperty({ required: false, example: 'example@example.com' })
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  readonly mail: string

  @ApiProperty({ required: false, example: 'http://example.com' })
  @IsUrl({ require_protocol: true }, { message: '请更正为正确的网址' })
  @IsOptional()
  readonly url?: string

  @ApiProperty({ required: false, example: 'https://cdn.jsdelivr.net/gh/suemor233/static@main/img/89030875.jpeg' })
  @IsAllowedUrl()
  @IsOptional()
  readonly avatar?: string


  @ApiProperty({ required: false, example: 'https://y.suemor.com/imagesva2022-255.png' })
  @IsAllowedUrl()
  @IsOptional()
  readonly backgroundImage?: string

  @IsOptional()
  @ApiProperty({ description: '各种社交 id 记录' })
  readonly socialIds?: Array<Record<string, any>> | Record<string, any>

  authCode!: string
}

export class UserDto extends UserOptionDto {
  @ApiProperty({example:"suemor"})
  @IsString()
  @IsNotEmpty({ message: '用户名？' })
  readonly username: string

  @IsString()
  @ApiProperty({example:"123456"})
  @IsNotEmpty({ message: '密码？' })
   password: string
}

export class LoginDto {
  @ApiProperty({ required: true })
  @IsString({ message: '用户名？' })
  username: string

  @ApiProperty({ required: true })
  @IsString({ message: '密码？' })
  password: string
}

export class UserPatchDto extends UserOptionDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly username: string

  @IsString()
  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsOptional()
  readonly password: string
}
