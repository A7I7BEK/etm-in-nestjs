import { OrderReverse } from 'src/common/pagination/order.enum';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { Brackets, Repository } from 'typeorm';
import { GroupPageFilterDto } from '../dto/group-page-filter.dto';
import { Group } from '../entities/group.entity';


export function loadQueryBuilder
    (
        repository: Repository<Group>,
        pageFilterDto: GroupPageFilterDto,
        activeUser: ActiveUserData,
    )
{
    const [ group, empl, leader, org, ] = [ 'group', 'employee', 'leader', 'organization' ];
    const queryBuilder = repository.createQueryBuilder(group);

    queryBuilder.leftJoinAndSelect(`${group}.employees`, empl);
    queryBuilder.leftJoinAndSelect(`${group}.leader`, leader);
    queryBuilder.leftJoinAndSelect(`${group}.organization`, org);
    queryBuilder.skip(pageFilterDto.skip);
    queryBuilder.take(pageFilterDto.perPage);
    queryBuilder.orderBy(group + '.' + pageFilterDto.sortBy, OrderReverse[ pageFilterDto.sortDirection ]);


    if (!activeUser.systemAdmin)
    {
        queryBuilder.andWhere(`${group}.organization = :orgId`, { orgId: activeUser.orgId });
    }
    else if (pageFilterDto.organizationId)
    {
        queryBuilder.andWhere(`${group}.organization = :orgId`, { orgId: pageFilterDto.organizationId });
    }


    if (pageFilterDto.allSearch)
    {
        queryBuilder.andWhere(
            new Brackets((qb) =>
            {
                qb.orWhere(`${group}.name ILIKE :search`, { search: `%${pageFilterDto.allSearch}%` });
            }),
        );
    }


    return queryBuilder;
}
