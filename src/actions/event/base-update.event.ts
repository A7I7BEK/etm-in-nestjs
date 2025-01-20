import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';

export interface BaseUpdateEvent<T, K>
{
    oldEntity: T;

    dto: K;

    activeUser: ActiveUserData;
}
