import { OrderReverse } from 'src/common/pagination/order.enum';
import { Brackets, Repository } from 'typeorm';
import { PermissionPageFilterDto } from '../dto/permission-page-filter.dto';
import { Permission } from '../entities/permission.entity';


export function loadQueryBuilder
    (
        repository: Repository<Permission>,
        pageFilterDto: PermissionPageFilterDto,
    )
{
    const [ perm ] = [ 'permission' ];
    const queryBuilder = repository.createQueryBuilder(perm);


    queryBuilder.skip(pageFilterDto.skip);
    queryBuilder.take(pageFilterDto.perPage);
    queryBuilder.orderBy(perm + '.' + pageFilterDto.sortBy, OrderReverse[ pageFilterDto.sortDirection ]);


    if (pageFilterDto.allSearch)
    {
        queryBuilder.andWhere(
            new Brackets((qb) =>
            {
                qb.orWhere(`${perm}.name ILIKE :search`, { search: `%${pageFilterDto.allSearch}%` });
                qb.orWhere(`${perm}.codeName ILIKE :search`, { search: `%${pageFilterDto.allSearch}%` });
            }),
        );
    }


    return queryBuilder;
}
