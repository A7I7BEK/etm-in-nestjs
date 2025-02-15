import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';

export interface BaseSimpleEvent<T>
{
    entity: T;

    activeUser: ActiveUserData;
}
