import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';

export interface BaseMoveEvent<T>
{
    oldEntity: T;

    newEntity: T;

    activeUser: ActiveUserData;
}
