import { OrderReverse } from 'src/common/pagination/order.enum';
import { Brackets, Repository } from 'typeorm';
import { OrganizationPageFilterDto } from '../dto/organization-page-filter.dto';
import { Organization } from '../entities/organization.entity';


export function loadQueryBuilder
    (
        repository: Repository<Organization>,
        pageFilterDto: OrganizationPageFilterDto,
    )
{
    const [ org ] = [ 'organization' ];
    const queryBuilder = repository.createQueryBuilder(org);


    queryBuilder.skip(pageFilterDto.skip);
    queryBuilder.take(pageFilterDto.perPage);
    queryBuilder.orderBy(org + '.' + pageFilterDto.sortBy, OrderReverse[ pageFilterDto.sortDirection ]);


    if (pageFilterDto.allSearch)
    {
        queryBuilder.andWhere(
            new Brackets((qb) =>
            {
                qb.orWhere(`${org}.name ILIKE :search`, { search: `%${pageFilterDto.allSearch}%` });
                qb.orWhere(`${org}.email ILIKE :search`, { search: `%${pageFilterDto.allSearch}%` });
            }),
        );
    }


    return queryBuilder;
}
