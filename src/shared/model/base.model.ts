import { ApiHideProperty } from "@nestjs/swagger"

export class BaseModel {
  @ApiHideProperty()
  created?: Date

  @ApiHideProperty()
  id?: string

  static get protectedKeys() {
    return ['created', 'id', '_id']
  }
}

