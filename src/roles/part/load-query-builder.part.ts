import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { Brackets, Repository } from 'typeorm';
import { RoleQueryDto } from '../dto/role-query.dto';
import { Role } from '../entity/role.entity';


export function loadQueryBuilderPart
    (
        repository: Repository<Role>,
        queryDto: RoleQueryDto,
        activeUser: ActiveUserData,
    )
{
    const [ role, perms, org ] =
        [ 'role', 'permissions', 'organization' ];
    const queryBuilder = repository.createQueryBuilder(role);


    queryBuilder.leftJoinAndSelect(`${role}.permissions`, perms);
    queryBuilder.leftJoinAndSelect(`${role}.organization`, org);
    queryBuilder.skip(queryDto.skip);
    queryBuilder.take(queryDto.pageSize);
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
                qb.orWhere(`${role}.name ILIKE :search`, { search: `%${queryDto.allSearch}%` });
            }),
        );
    }


    return queryBuilder;
}
