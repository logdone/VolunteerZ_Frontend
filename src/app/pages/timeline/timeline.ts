import { BaseEntity } from "src/model/base-entity";

export class Timeline implements BaseEntity {
    constructor(
      public id?: number,
      public action?: string,
      public time?: string,
      public targetObject?: string
      ){}

}
