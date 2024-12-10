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
    const [ role, org ] = [ 'role', 'organization' ];
    const queryBuilder = repository.createQueryBuilder(role);


    queryBuilder.leftJoinAndSelect(`${role}.organization`, org);
    queryBuilder.skip(queryDto.skip);
    queryBuilder.take(queryDto.perPage);
    queryBuilder.orderBy(role + '.' + queryDto.sortBy, queryDto.order);


    if (!activeUser.systemAdmin)
    {
        queryBuilder.andWhere(`${role}.organization = :orgId`, { orgId: activeUser.orgId });
    }
    else if (queryDto.organizationId) // BINGO: activeUser.systemAdmin && queryDto.organizationId
    {
        queryBuilder.andWhere(`${role}.organization = :orgId`, { orgId: queryDto.organizationId });
    }


    if (queryDto.allSearch)
    {
        queryBuilder.andWhere(
            new Brackets((qb) =>
            {
                qb.orWhere(`${role}.codeName ILIKE :search`, { search: `%${queryDto.allSearch}%` });
                qb.orWhere(`${role}.roleName ILIKE :search`, { search: `%${queryDto.allSearch}%` });
            }),
        );
    }


    return queryBuilder;
}