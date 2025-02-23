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
    const [ mem, pMember, empl, user, task, proj, org ] =
        [ 'taskMember', 'projectMember', 'employee', 'user', 'task', 'project', 'organization' ];
    const queryBuilder = repository.createQueryBuilder(mem);


    queryBuilder.leftJoinAndSelect(`${mem}.projectMember`, pMember);
    queryBuilder.leftJoinAndSelect(`${pMember}.employee`, empl);
    queryBuilder.leftJoinAndSelect(`${empl}.user`, user);
    queryBuilder.leftJoinAndSelect(`${mem}.task`, task);
    queryBuilder.leftJoin(`${task}.project`, proj);
    queryBuilder.leftJoin(`${proj}.organization`, org);
    queryBuilder.skip(queryDto.skip);
    queryBuilder.take(queryDto.pageSize);
    queryBuilder.orderBy(mem + '.' + queryDto.sortBy, queryDto.order);


    queryBuilder.andWhere(`${mem}.task = :taskId`, { taskId: queryDto.taskId });


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
