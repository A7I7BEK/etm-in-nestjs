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
    const [ notif, action, aEmployee, aUser, aProject, aTask, user, org ] =
        [ 'notification', 'action', 'aEmployee', 'aUser', 'aProject', 'aTask', 'user', 'organization' ];
    const queryBuilder = repository.createQueryBuilder(notif);


    queryBuilder.leftJoinAndSelect(`${notif}.action`, action);
    queryBuilder.leftJoinAndSelect(`${action}.employee`, aEmployee);
    queryBuilder.leftJoin(`${aEmployee}.user`, aUser);
    queryBuilder.addSelect([ // BINGO: select only needed fields
        `${aUser}.id`,
        `${aUser}.userName`,
        `${aUser}.email`,
        `${aUser}.phoneNumber`,
    ]);
    queryBuilder.leftJoinAndSelect(`${action}.project`, aProject);
    queryBuilder.leftJoinAndSelect(`${action}.task`, aTask);
    queryBuilder.leftJoin(`${notif}.user`, user);
    queryBuilder.leftJoin(`${user}.organization`, org); // BINGO: join but not select
    queryBuilder.skip(queryDto.skip);
    queryBuilder.take(queryDto.pageSize);
    queryBuilder.orderBy(notif + '.' + queryDto.sortBy, queryDto.order);


    queryBuilder.andWhere(`${notif}.user = :userId`, { userId: activeUser.sub });
    queryBuilder.andWhere(`${user}.organization = :orgId`, { orgId: activeUser.orgId });


    if (queryDto.allSearch)
    {
        queryBuilder.andWhere(
            new Brackets((qb) =>
            {
                qb.orWhere(`${aEmployee}.firstName ILIKE :search`, { search: `%${queryDto.allSearch}%` });
                qb.orWhere(`${aEmployee}.lastName ILIKE :search`, { search: `%${queryDto.allSearch}%` });
                qb.orWhere(`${aEmployee}.middleName ILIKE :search`, { search: `%${queryDto.allSearch}%` });
                qb.orWhere(`${aTask}.name ILIKE :search`, { search: `%${queryDto.allSearch}%` });
                qb.orWhere(`${aTask}.description ILIKE :search`, { search: `%${queryDto.allSearch}%` });
            }),
        );
    }


    return queryBuilder;
}
