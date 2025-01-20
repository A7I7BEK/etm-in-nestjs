import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';

export interface BaseDeleteEvent<T>
{
    entity: T;

    activeUser: ActiveUserData;
}
