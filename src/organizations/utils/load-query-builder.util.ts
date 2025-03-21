import { Brackets, Repository } from 'typeorm';
import { OrganizationQueryDto } from '../dto/organization-query.dto';
import { Organization } from '../entities/organization.entity';


export function loadQueryBuilder
    (
        repository: Repository<Organization>,
        queryDto: OrganizationQueryDto,
    )
{
    const [ org ] = [ 'organization' ];
    const queryBuilder = repository.createQueryBuilder(org);


    queryBuilder.skip(queryDto.skip);
    queryBuilder.take(queryDto.pageSize);
    queryBuilder.orderBy(org + '.' + queryDto.sortBy, queryDto.order);


    if (queryDto.allSearch)
    {
        queryBuilder.andWhere(
            new Brackets((qb) =>
            {
                qb.orWhere(`${org}.name ILIKE :search`, { search: `%${queryDto.allSearch}%` });
                qb.orWhere(`${org}.email ILIKE :search`, { search: `%${queryDto.allSearch}%` });
            }),
        );
    }


    return queryBuilder;
}
