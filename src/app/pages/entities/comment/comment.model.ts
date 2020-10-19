import { BaseEntity } from 'src/model/base-entity';
import { Event } from '../event/event.model';
import { ExtendedUser } from '../extended-user/extended-user.model';

export class Comment implements BaseEntity {
  constructor(public id?: number, public commentBody?: string, public event?: Event, public extendedUser?: ExtendedUser) {}
}
