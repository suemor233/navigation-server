import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'


import { BaseModel } from '~/shared/model/base.model'
import { ApiProperty } from '@nestjs/swagger'




// @modelOptions({ options: { customName: 'About' } })
// export class AboutModel extends BaseModel {
//   @prop({ required: true })
//   @ApiProperty({ required: true, example: '出生日期' })
//   @IsOptional()
//   @IsString()
//   @IsNotEmpty()
//   name: string

//   @prop({required:true})
//   @ApiProperty({ required: true, example: '2003/11/06' })
//   @IsOptional()
//   value: string
// }

