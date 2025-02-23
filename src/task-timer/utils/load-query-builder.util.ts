import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { Brackets, Repository } from 'typeorm';
import { TaskTimerQueryDto } from '../dto/task-timer-query.dto';
import { TaskTimer } from '../entities/task-timer.entity';


export function loadQueryBuilder
    (
        repository: Repository<TaskTimer>,
        queryDto: TaskTimerQueryDto,
        activeUser: ActiveUserData,
    )
{
    const [ timer, empl, user, task, proj, org ] =
        [ 'taskTimer', 'employee', 'user', 'task', 'project', 'organization' ];
    const queryBuilder = repository.createQueryBuilder(timer);


    queryBuilder.leftJoinAndSelect(`${timer}.employee`, empl);
    queryBuilder.leftJoinAndSelect(`${empl}.user`, user);
    queryBuilder.leftJoinAndSelect(`${timer}.task`, task);
    queryBuilder.leftJoin(`${task}.project`, proj);
    queryBuilder.leftJoin(`${proj}.organization`, org);
    queryBuilder.skip(queryDto.skip);
    queryBuilder.take(queryDto.pageSize);
    queryBuilder.orderBy(timer + '.' + queryDto.sortBy, queryDto.order);


    queryBuilder.andWhere(`${timer}.task = :taskId`, { taskId: queryDto.taskId });


    if (!activeUser.systemAdmin)
    {
        queryBuilder.andWhere(`${proj}.organization = :orgId`, { orgId: activeUser.orgId });
    }


    if (queryDto.allSearch)
    {
        queryBuilder.andWhere(
            new Brackets((qb) =>
            {
                qb.orWhere(`${task}.name ILIKE :search`, { search: `%${queryDto.allSearch}%` });
            }),
        );
    }


    return queryBuilder;
}
