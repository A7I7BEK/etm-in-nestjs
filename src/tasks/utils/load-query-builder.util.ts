import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { Brackets, Repository } from 'typeorm';
import { TaskQueryDto } from '../dto/task-query.dto';
import { Task } from '../entities/task.entity';
import { TaskPropertiesReal } from '../enums/task-properties.enum';


export function loadQueryBuilder
    (
        repository: Repository<Task>,
        queryDto: TaskQueryDto,
        activeUser: ActiveUserData,
    )
{
    const [ task, column, project, org, members, pMember, empl, user ] =
        [ 'task', 'column', 'project', 'organization', 'members', 'projectMember', 'employee', 'user' ];
    const queryBuilder = repository.createQueryBuilder(task);


    queryBuilder.leftJoinAndSelect(`${task}.column`, column);
    queryBuilder.leftJoinAndSelect(`${task}.project`, project);
    queryBuilder.leftJoin(`${project}.organization`, org);
    queryBuilder.leftJoin(`${task}.members`, members);
    queryBuilder.leftJoin(`${members}.projectMember`, pMember);
    queryBuilder.leftJoin(`${pMember}.employee`, empl);
    queryBuilder.leftJoin(`${empl}.user`, user);
    queryBuilder.skip(queryDto.skip);
    queryBuilder.take(queryDto.perPage);
    queryBuilder.orderBy(
        task + '.' + TaskPropertiesReal[ queryDto.sortBy ],
        queryDto.order
    );


    if (queryDto.columnId)
    {
        queryBuilder.andWhere(`${task}.column = :colId`, { colId: queryDto.columnId });
    }


    if (queryDto.projectId)
    {
        queryBuilder.andWhere(`${task}.project = :projId`, { projId: queryDto.projectId });
    }


    if (queryDto.ownTask && !activeUser.systemAdmin)
    {
        // TODO: check if it is working
        queryBuilder.andWhere(`${empl}.user = :userId`, { userId: activeUser.sub });
    }


    const now = new Date();
    if (queryDto.deadLine)
    {
        queryBuilder.andWhere(`${task}.endDate = :endDate`, { endDate: queryDto.deadLine });
    }
    else if (queryDto.hasNoDeadline)
    {
        queryBuilder.andWhere(`${task}.endDate IS NULL`);
    }
    else if (queryDto.inNextDay)
    {
        const nextDay = new Date(now);
        nextDay.setDate(now.getDate() + 1);

        queryBuilder.andWhere(`${task}.endDate BETWEEN :now AND :nextDay`, { now, nextDay });
    }
    else if (queryDto.inNextWeek)
    {
        const nextWeek = new Date(now);
        nextWeek.setDate(now.getDate() + 7);

        queryBuilder.andWhere(`${task}.endDate BETWEEN :now AND :nextWeek`, { now, nextWeek });
    }
    else if (queryDto.inNextMonth)
    {
        const nextMonth = new Date(now);
        nextMonth.setMonth(now.getMonth() + 1);

        queryBuilder.andWhere(`${task}.endDate BETWEEN :now AND :nextMonth`, { now, nextMonth });
    }
    else if (queryDto.overdue)
    {
        queryBuilder.andWhere(`${task}.endDate < :now`, { now });
    }


    if (!activeUser.systemAdmin)
    {
        queryBuilder.andWhere(`${project}.organization = :orgId`, { orgId: activeUser.orgId });
    }


    if (queryDto.allSearch)
    {
        queryBuilder.andWhere(
            new Brackets((qb) =>
            {
                qb.orWhere(`${task}.name ILIKE :search`, { search: `%${queryDto.allSearch}%` });
                qb.orWhere(`${task}.description ILIKE :search`, { search: `%${queryDto.allSearch}%` });
            }),
        );
    }


    return queryBuilder;
}
