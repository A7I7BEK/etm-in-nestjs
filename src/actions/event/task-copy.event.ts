import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';

export interface TaskCopyEvent<T>
{
    oldEntity: T;

    newEntity: T;

    activeUser: ActiveUserData;
}
