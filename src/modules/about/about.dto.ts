import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'


import { ApiProperty } from '@nestjs/swagger'

export class BasicModel {
  @ApiProperty({ required: true, example: '出生日期' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly key: string

  @ApiProperty({ required: true, example: '2003/11/06' })
  @IsOptional()
  readonly value: string
}


export class DetailModel {
  @ApiProperty({ required: true, example: '标题' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly title: string

  @ApiProperty({ required: true, example: '内容' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly content: string
}
