import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'


import { ApiProperty } from '@nestjs/swagger'
import { IsAllowedUrl } from '~/utils/validator/isAllowedUrl'

export class ProjectModel {
  @ApiProperty({ required: true, example: '搜索页' })
  @IsNotEmpty({ message: '名称不能为空' })
  readonly name: string

  @ApiProperty({ required: false, example: 'https://n.suemor.com/' })
  @IsAllowedUrl()
  @IsOptional()
  readonly url: string

  @ApiProperty({ required: false, example: 'https://cdn.jsdelivr.net/gh/suemor233/static@main/img/na-image-3.jpg' })
  @IsAllowedUrl()
  @IsNotEmpty({ message: '图片不能为空' })
  readonly img: string
}


