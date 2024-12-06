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
    const [ comment, auth, authUser, members, memUser, task, proj, org ] =
        [ 'taskComment', 'author', 'authUser', 'members', 'memUser', 'task', 'project', 'organization' ];
    const queryBuilder = repository.createQueryBuilder(comment);


    queryBuilder.leftJoinAndSelect(`${comment}.author`, auth);
    queryBuilder.leftJoinAndSelect(`${auth}.user`, authUser);
    queryBuilder.leftJoinAndSelect(`${comment}.members`, members);
    queryBuilder.leftJoinAndSelect(`${members}.user`, memUser);
    queryBuilder.leftJoinAndSelect(`${comment}.task`, task);
    queryBuilder.leftJoin(`${task}.project`, proj);
    queryBuilder.leftJoin(`${proj}.organization`, org);
    queryBuilder.skip(queryDto.skip);
    queryBuilder.take(queryDto.perPage);
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
                qb.orWhere(`${members}.firstName ILIKE :search`, { search: `%${queryDto.allSearch}%` });
                qb.orWhere(`${members}.lastName ILIKE :search`, { search: `%${queryDto.allSearch}%` });
                qb.orWhere(`${members}.middleName ILIKE :search`, { search: `%${queryDto.allSearch}%` });
                qb.orWhere(`${memUser}.userName ILIKE :search`, { search: `%${queryDto.allSearch}%` });
            }),
        );
    }


    return queryBuilder;
}
