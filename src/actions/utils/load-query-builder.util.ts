import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { Brackets, Repository } from 'typeorm';
import { ActionQueryDto } from '../dto/action-query.dto';
import { Action } from '../entities/action.entity';


export function loadQueryBuilder
    (
        repository: Repository<Action>,
        queryDto: ActionQueryDto,
        activeUser: ActiveUserData,
    )
{
    const [ action, empl, user, task, proj, org ] =
        [ 'action', 'employee', 'user', 'task', 'project', 'organization' ];
    const queryBuilder = repository.createQueryBuilder(action);


    queryBuilder.leftJoinAndSelect(`${action}.employee`, empl);
    queryBuilder.leftJoin(`${empl}.user`, user);
    queryBuilder.addSelect([
        `${user}.id`,
        `${user}.userName`,
        `${user}.email`,
        `${user}.phoneNumber`,
    ]);
    queryBuilder.leftJoinAndSelect(`${action}.task`, task);
    queryBuilder.leftJoinAndSelect(`${action}.project`, proj);
    queryBuilder.leftJoin(`${proj}.organization`, org);
    queryBuilder.skip(queryDto.skip);
    queryBuilder.take(queryDto.perPage);
    queryBuilder.orderBy(action + '.' + queryDto.sortBy, queryDto.order);


    if (!activeUser.systemAdmin)
    {
        queryBuilder.andWhere(`${proj}.organization = :orgId`, { orgId: activeUser.orgId });
    }


    if (queryDto.taskId)
    {
        queryBuilder.andWhere(`${action}.task = :taskId`, { taskId: queryDto.taskId });
    }


    if (queryDto.projectId)
    {
        queryBuilder.andWhere(`${action}.project = :prId`, { prId: queryDto.projectId });
    }


    if (queryDto.allSearch)
    {
        queryBuilder.andWhere(
            new Brackets((qb) =>
            {
                qb.orWhere(`${empl}.firstName ILIKE :search`, { search: `%${queryDto.allSearch}%` });
                qb.orWhere(`${empl}.lastName ILIKE :search`, { search: `%${queryDto.allSearch}%` });
                qb.orWhere(`${empl}.middleName ILIKE :search`, { search: `%${queryDto.allSearch}%` });
                qb.orWhere(`${user}.userName ILIKE :search`, { search: `%${queryDto.allSearch}%` });
                qb.orWhere(`${user}.email ILIKE :search`, { search: `%${queryDto.allSearch}%` });
                qb.orWhere(`${task}.name ILIKE :search`, { search: `%${queryDto.allSearch}%` });
                qb.orWhere(`${proj}.name ILIKE :search`, { search: `%${queryDto.allSearch}%` });
            }),
        );
    }


    return queryBuilder;
}
