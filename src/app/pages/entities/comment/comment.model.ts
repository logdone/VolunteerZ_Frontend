import { BaseEntity } from 'src/model/base-entity';
import { Event } from '../event/event.model';
import { User } from '../../../services/user/user.model';

export class Comment implements BaseEntity {
    constructor(
        public id?: number,
        public commentBody?: string,
        public event?: Event,
        public user?: User,
        public commentReports? : User[],
        public isReported? : boolean,

    ) {
    }
}
