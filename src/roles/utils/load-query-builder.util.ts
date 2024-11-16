import { OrderReverse } from 'src/common/pagination/order.enum';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { Brackets, Repository } from 'typeorm';
import { RolePageFilterDto } from '../dto/role-page-filter.dto';
import { Role } from '../entities/role.entity';


export function loadQueryBuilder
    (
        repository: Repository<Role>,
        pageFilterDto: RolePageFilterDto,
        activeUser: ActiveUserData,
    )
{
    const [ role, org ] = [ 'role', 'organization' ];

    const queryBuilder = repository.createQueryBuilder(role);
    queryBuilder.leftJoinAndSelect(`${role}.organization`, org);
    queryBuilder.skip(pageFilterDto.skip);
    queryBuilder.take(pageFilterDto.perPage);
    queryBuilder.orderBy(role + '.' + pageFilterDto.sortBy, OrderReverse[ pageFilterDto.sortDirection ]);

    if (!activeUser.systemAdmin)
    {
        queryBuilder.andWhere(`${role}.organization = :orgId`, { orgId: activeUser.orgId });
    }
    else if (pageFilterDto.organizationId) // BINGO: activeUser.systemAdmin && pageFilterDto.organizationId
    {
        queryBuilder.andWhere(`${role}.organization = :orgId`, { orgId: pageFilterDto.organizationId });
    }

    if (pageFilterDto.allSearch)
    {
        queryBuilder.andWhere(
            new Brackets((qb) =>
            {
                qb.orWhere(`${role}.codeName ILIKE :search`, { search: `%${pageFilterDto.allSearch}%` });
                qb.orWhere(`${role}.roleName ILIKE :search`, { search: `%${pageFilterDto.allSearch}%` });
            }),
        );
    }

    return queryBuilder;
}
