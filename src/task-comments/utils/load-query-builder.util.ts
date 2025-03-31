import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { Brackets, Repository } from 'typeorm';
import { TaskCommentQueryDto } from '../dto/task-comment-query.dto';
import { TaskComment } from '../entities/task-comment.entity';


export function loadQueryBuilder
    (
        repository: Repository<TaskComment>,
        queryDto: TaskCommentQueryDto,
        activeUser: ActiveUserData,
    )
{
    const [ comment, auth, aPhoto, aUser, employees, ePhoto, eUser, task, proj, org ] =
        [ 'taskComment', 'author', 'aPhoto', 'aUser', 'employees', 'ePhoto', 'eUser', 'task', 'project', 'organization' ];
    const queryBuilder = repository.createQueryBuilder(comment);


    queryBuilder.leftJoinAndSelect(`${comment}.author`, auth);
    queryBuilder.leftJoinAndSelect(`${auth}.photoFile`, aPhoto);
    queryBuilder.leftJoinAndSelect(`${auth}.user`, aUser);
    queryBuilder.leftJoinAndSelect(`${comment}.employees`, employees);
    queryBuilder.leftJoinAndSelect(`${employees}.photoFile`, ePhoto);
    queryBuilder.leftJoinAndSelect(`${employees}.user`, eUser);
    queryBuilder.leftJoinAndSelect(`${comment}.task`, task);
    queryBuilder.leftJoin(`${task}.project`, proj);
    queryBuilder.leftJoin(`${proj}.organization`, org);
    queryBuilder.skip(queryDto.skip);
    queryBuilder.take(queryDto.pageSize);
    queryBuilder.orderBy(comment + '.' + queryDto.sortBy, queryDto.order);


    queryBuilder.andWhere(`${task}.project = :projId`, { projId: queryDto.projectId });


    if (queryDto.taskId)
    {
        queryBuilder.andWhere(`${comment}.task = :taskId`, { taskId: queryDto.taskId });
    }


    if (!activeUser.systemAdmin)
    {
        queryBuilder.andWhere(`${proj}.organization = :orgId`, { orgId: activeUser.orgId });
    }


    if (queryDto.allSearch)
    {
        queryBuilder.andWhere(
            new Brackets((qb) =>
            {
                qb.orWhere(`${comment}.commentText ILIKE :search`, { search: `%${queryDto.allSearch}%` });
                qb.orWhere(`${employees}.firstName ILIKE :search`, { search: `%${queryDto.allSearch}%` });
                qb.orWhere(`${employees}.lastName ILIKE :search`, { search: `%${queryDto.allSearch}%` });
                qb.orWhere(`${employees}.middleName ILIKE :search`, { search: `%${queryDto.allSearch}%` });
                qb.orWhere(`${eUser}.userName ILIKE :search`, { search: `%${queryDto.allSearch}%` });
            }),
        );
    }


    return queryBuilder;
}
