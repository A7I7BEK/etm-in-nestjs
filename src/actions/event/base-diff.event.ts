import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';

export interface BaseDiffEvent<T>
{
    oldEntity: T;

    newEntity: T;

    activeUser: ActiveUserData;
}
