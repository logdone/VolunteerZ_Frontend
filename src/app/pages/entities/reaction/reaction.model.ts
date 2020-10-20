import { BaseEntity } from 'src/model/base-entity';
import { Event } from '../event/event.model';
import { User } from '../../../services/user/user.model';

export class Reaction implements BaseEntity {
    constructor(
        public id?: number,
        public event?: Event,
        public user?: User,
    ) {
    }
}
