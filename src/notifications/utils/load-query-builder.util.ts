import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { Brackets, Repository } from 'typeorm';
import { NotificationQueryDto } from '../dto/notification-query.dto';
import { Notification } from '../entities/notification.entity';


export function loadQueryBuilder
    (
        repository: Repository<Notification>,
        queryDto: NotificationQueryDto,
        activeUser: ActiveUserData,
    )
{
    const [ notif, action, empl, task, user, org ] =
        [ 'notification', 'action', 'employee', 'task', 'user', 'organization' ];
    const queryBuilder = repository.createQueryBuilder(notif);


    queryBuilder.leftJoinAndSelect(`${notif}.action`, action);
    queryBuilder.leftJoin(`${action}.employee`, empl);
    queryBuilder.leftJoin(`${action}.task`, task);
    queryBuilder.leftJoin(`${notif}.user`, user);
    queryBuilder.leftJoin(`${user}.organization`, org);
    queryBuilder.skip(queryDto.skip);
    queryBuilder.take(queryDto.perPage);
    queryBuilder.orderBy(notif + '.' + queryDto.sortBy, queryDto.order);


    queryBuilder.andWhere(`${notif}.user = :userId`, { userId: activeUser.sub });
    queryBuilder.andWhere(`${user}.organization = :orgId`, { orgId: activeUser.orgId });


    if (queryDto.allSearch)
    {
        queryBuilder.andWhere(
            new Brackets((qb) =>
            {
                qb.orWhere(`${empl}.firstName ILIKE :search`, { search: `%${queryDto.allSearch}%` });
                qb.orWhere(`${empl}.lastName ILIKE :search`, { search: `%${queryDto.allSearch}%` });
                qb.orWhere(`${empl}.middleName ILIKE :search`, { search: `%${queryDto.allSearch}%` });
                qb.orWhere(`${task}.name ILIKE :search`, { search: `%${queryDto.allSearch}%` });
                qb.orWhere(`${task}.description ILIKE :search`, { search: `%${queryDto.allSearch}%` });
            }),
        );
    }


    return queryBuilder;
}
