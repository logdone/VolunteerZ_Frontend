import { BaseEntity } from 'src/model/base-entity';
import { User } from '../../../services/user/user.model';

export class Event implements BaseEntity {
  constructor(
    public id?: number,
    public title?: string,
    public eventDescription?: string,
    public eventImage?: string,
    public category?: string,
    public creationDate?: any,
    public eventDate?: any,
    public maxNumberVolunteers?: number,
    public nbrReports?: number,
    public link?: string,
    public location?: string,
    public participants?: User[],
    public owner?: User
  ) {}
}
