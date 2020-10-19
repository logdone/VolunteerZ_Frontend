import { BaseEntity } from 'src/model/base-entity';
import { Comment } from '../comment/comment.model';
import { Reaction } from '../reaction/reaction.model';
import { Event } from '../event/event.model';

export class ExtendedUser implements BaseEntity {
  constructor(public id?: number, public comments?: Comment[], public reactions?: Reaction[], public event?: Event) {}
}
