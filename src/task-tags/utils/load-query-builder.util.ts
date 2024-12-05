import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { Brackets, Repository } from 'typeorm';
import { TaskTagQueryDto } from '../dto/task-tag-query.dto';
import { TaskTag } from '../entities/task-tag.entity';


export function loadQueryBuilder
    (
        repository: Repository<TaskTag>,
        queryDto: TaskTagQueryDto,
        activeUser: ActiveUserData,
    )
{
    const [ tag, pTag, task, proj, org ] =
        [ 'taskTag', 'projectTag', 'task', 'project', 'organization' ];
    const queryBuilder = repository.createQueryBuilder(tag);


    queryBuilder.leftJoinAndSelect(`${tag}.projectTag`, pTag);
    queryBuilder.leftJoinAndSelect(`${tag}.task`, task);
    queryBuilder.leftJoin(`${task}.project`, proj);
    queryBuilder.leftJoin(`${proj}.organization`, org);
    queryBuilder.skip(queryDto.skip);
    queryBuilder.take(queryDto.perPage);
    queryBuilder.orderBy(tag + '.' + queryDto.sortBy, queryDto.order);


    queryBuilder.andWhere(`${tag}.task = :taskId`, { taskId: queryDto.taskId });


    if (!activeUser.systemAdmin)
    {
        queryBuilder.andWhere(`${proj}.organization = :orgId`, { orgId: activeUser.orgId });
    }


    if (queryDto.allSearch)
    {
        queryBuilder.andWhere(
            new Brackets((qb) =>
            {
                qb.orWhere(`${pTag}.name ILIKE :search`, { search: `%${queryDto.allSearch}%` });
                qb.orWhere(`${pTag}.color ILIKE :search`, { search: `%${queryDto.allSearch}%` });
            }),
        );
    }


    return queryBuilder;
}
