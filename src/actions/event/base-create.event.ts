import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';

export interface BaseCreateEvent<T>
{
    entity: T;

    activeUser: ActiveUserData;
}
