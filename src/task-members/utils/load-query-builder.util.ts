import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { Brackets, Repository } from 'typeorm';
import { TaskMemberQueryDto } from '../dto/task-member-query.dto';
import { TaskMember } from '../entities/task-member.entity';


export function loadQueryBuilder
    (
        repository: Repository<TaskMember>,
        queryDto: TaskMemberQueryDto,
        activeUser: ActiveUserData,
    )
{
    const [ tMember, empl, user, task, proj, org ] =
        [ 'taskMember', 'employee', 'user', 'task', 'project', 'organization' ];
    const queryBuilder = repository.createQueryBuilder(tMember);


    queryBuilder.leftJoinAndSelect(`${tMember}.employee`, empl);
    queryBuilder.leftJoinAndSelect(`${empl}.user`, user);
    queryBuilder.leftJoinAndSelect(`${tMember}.task`, task);
    queryBuilder.leftJoin(`${task}.project`, proj);
    queryBuilder.leftJoin(`${proj}.organization`, org);
    queryBuilder.skip(queryDto.skip);
    queryBuilder.take(queryDto.perPage);
    queryBuilder.orderBy(tMember + '.' + queryDto.sortBy, queryDto.order);


    queryBuilder.andWhere(`${tMember}.task = :taskId`, { taskId: queryDto.taskId });


    if (!activeUser.systemAdmin)
    {
        queryBuilder.andWhere(`${proj}.organization = :orgId`, { orgId: activeUser.orgId });
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
            }),
        );
    }


    return queryBuilder;
}
