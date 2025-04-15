import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { Brackets, Repository } from 'typeorm';
import { CheckListGroupQueryDto } from '../dto/check-list-group-query.dto';
import { CheckListGroup } from '../entities/check-list-group.entity';


export function loadQueryBuilder
    (
        repository: Repository<CheckListGroup>,
        queryDto: CheckListGroupQueryDto,
        activeUser: ActiveUserData,
    )
{
    const [ chGroup, checkList, employees, user, task, proj, org ] =
        [ 'chGroup', 'checkList', 'employees', 'user', 'task', 'project', 'organization' ];
    const queryBuilder = repository.createQueryBuilder(chGroup);


    queryBuilder.leftJoinAndSelect(`${chGroup}.checkList`, checkList);
    queryBuilder.leftJoinAndSelect(`${checkList}.employees`, employees);
    queryBuilder.leftJoinAndSelect(`${employees}.user`, user);
    queryBuilder.leftJoinAndSelect(`${chGroup}.task`, task);
    queryBuilder.leftJoin(`${task}.project`, proj);
    queryBuilder.leftJoin(`${proj}.organization`, org);
    queryBuilder.skip(queryDto.skip);
    queryBuilder.take(queryDto.pageSize);
    queryBuilder.orderBy(chGroup + '.' + queryDto.sortBy, queryDto.order);


    queryBuilder.andWhere(`${chGroup}.task = :taskId`, { taskId: queryDto.taskId });


    if (!activeUser.systemAdmin)
    {
        queryBuilder.andWhere(`${proj}.organization = :orgId`, { orgId: activeUser.orgId });
    }


    if (queryDto.allSearch)
    {
        queryBuilder.andWhere(
            new Brackets((qb) =>
            {
                qb.orWhere(`${chGroup}.name ILIKE :search`, { search: `%${queryDto.allSearch}%` });
            }),
        );
    }


    return queryBuilder;
}
