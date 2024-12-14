import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { Brackets, Repository } from 'typeorm';
import { TaskAttachmentQueryDto } from '../dto/task-attachment-query.dto';
import { TaskAttachment } from '../entities/task-attachment.entity';


export function loadQueryBuilder
    (
        repository: Repository<TaskAttachment>,
        queryDto: TaskAttachmentQueryDto,
        activeUser: ActiveUserData,
    )
{
    const [ attachment, file, task, proj, org ] =
        [ 'attachment', 'file', 'task', 'project', 'organization' ];
    const queryBuilder = repository.createQueryBuilder(attachment);


    queryBuilder.leftJoinAndSelect(`${attachment}.file`, file);
    queryBuilder.leftJoinAndSelect(`${attachment}.task`, task);
    queryBuilder.leftJoin(`${task}.project`, proj);
    queryBuilder.leftJoin(`${proj}.organization`, org);
    queryBuilder.skip(queryDto.skip);
    queryBuilder.take(queryDto.perPage);
    queryBuilder.orderBy(attachment + '.' + queryDto.sortBy, queryDto.order);


    queryBuilder.andWhere(`${attachment}.task = :taskId`, { taskId: queryDto.taskId });


    if (!activeUser.systemAdmin)
    {
        queryBuilder.andWhere(`${proj}.organization = :orgId`, { orgId: activeUser.orgId });
    }


    if (queryDto.allSearch)
    {
        queryBuilder.andWhere(
            new Brackets((qb) =>
            {
                qb.orWhere(`${file}.name ILIKE :search`, { search: `%${queryDto.allSearch}%` });
            }),
        );
    }


    return queryBuilder;
}
