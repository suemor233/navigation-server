import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'


import { ApiProperty } from '@nestjs/swagger'

export class StackModel {


  
  @ApiProperty({ required: true, example: 'vue3' })
  @IsString()
  @IsNotEmpty()
  readonly name: string

  @ApiProperty({ required: true, example: 50 })
  @IsNumber()
  readonly progressValue: number

}

