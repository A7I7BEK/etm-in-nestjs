import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { Brackets, Repository } from 'typeorm';
import { GroupQueryDto } from '../dto/group-query.dto';
import { Group } from '../entities/group.entity';


export function loadQueryBuilder
    (
        repository: Repository<Group>,
        queryDto: GroupQueryDto,
        activeUser: ActiveUserData,
    )
{
    const [ group, empl, leader, org, ] = [ 'group', 'employee', 'leader', 'organization' ];
    const queryBuilder = repository.createQueryBuilder(group);

    queryBuilder.leftJoinAndSelect(`${group}.employees`, empl);
    queryBuilder.leftJoinAndSelect(`${group}.leader`, leader);
    queryBuilder.leftJoinAndSelect(`${group}.organization`, org);
    queryBuilder.skip(queryDto.skip);
    queryBuilder.take(queryDto.pageSize);
    queryBuilder.orderBy(group + '.' + queryDto.sortBy, queryDto.order);


    if (!activeUser.systemAdmin)
    {
        queryBuilder.andWhere(`${group}.organization = :orgId`, { orgId: activeUser.orgId });
    }
    else if (queryDto.organizationId)
    {
        queryBuilder.andWhere(`${group}.organization = :orgId`, { orgId: queryDto.organizationId });
    }


    if (queryDto.allSearch)
    {
        queryBuilder.andWhere(
            new Brackets((qb) =>
            {
                qb.orWhere(`${group}.name ILIKE :search`, { search: `%${queryDto.allSearch}%` });
            }),
        );
    }


    return queryBuilder;
}
