import { OrderReal } from 'src/common/pagination/order.enum';
import { Brackets, Repository } from 'typeorm';
import { PermissionQueryDto } from '../dto/permission-query.dto';
import { Permission } from '../entities/permission.entity';


export function loadQueryBuilder
    (
        repository: Repository<Permission>,
        queryDto: PermissionQueryDto,
    )
{
    const [ perm ] = [ 'permission' ];
    const queryBuilder = repository.createQueryBuilder(perm);


    queryBuilder.skip(queryDto.skip);
    queryBuilder.take(queryDto.perPage);
    queryBuilder.orderBy(perm + '.' + queryDto.sortBy, OrderReal[ queryDto.sortDirection ]);


    if (queryDto.allSearch)
    {
        queryBuilder.andWhere(
            new Brackets((qb) =>
            {
                qb.orWhere(`${perm}.name ILIKE :search`, { search: `%${queryDto.allSearch}%` });
                qb.orWhere(`${perm}.codeName ILIKE :search`, { search: `%${queryDto.allSearch}%` });
            }),
        );
    }


    return queryBuilder;
}
