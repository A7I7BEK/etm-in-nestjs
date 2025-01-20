import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';

export interface BaseCreateEvent<T, K>
{
    entity: T;

    dto: K;

    activeUser: ActiveUserData;
}
