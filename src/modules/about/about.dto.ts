import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'


import { ApiProperty } from '@nestjs/swagger'

export class AboutModel {
  @ApiProperty({ required: true, example: '出生日期' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly key: string

  @ApiProperty({ required: true, example: '2003/11/06' })
  @IsOptional()
  readonly value: string

  @ApiProperty({ required: false, example: '2003/11/06' })
  @IsOptional()
  readonly flagDetail: boolean
}

