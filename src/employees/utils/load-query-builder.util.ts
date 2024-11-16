import { OrderReverse } from 'src/common/pagination/order.enum';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { Brackets, Repository } from 'typeorm';
import { EmployeePageFilterDto } from '../dto/employee-page-filter.dto';
import { Employee } from '../entities/employee.entity';
import { EmployeeProperties } from '../enums/employee-properties.enum';


export function loadQueryBuilder(
    repository: Repository<Employee>,
    pageFilterDto: EmployeePageFilterDto,
    activeUser: ActiveUserData,
)
{
    const [ empl, user, org, role ] = [ 'employee', 'user', 'organization', 'role' ];

    // BINGO
    const sortBy = (<any>Object)
        .values(EmployeeProperties)
        .includes(pageFilterDto.sortBy)
        ? empl + '.' + pageFilterDto.sortBy
        : user + '.' + pageFilterDto.sortBy;


    const queryBuilder = repository.createQueryBuilder(empl);
    queryBuilder.leftJoinAndSelect(`${empl}.user`, user);
    queryBuilder.leftJoinAndSelect(`${user}.organization`, org);
    queryBuilder.leftJoinAndSelect(`${user}.roles`, role);
    queryBuilder.skip(pageFilterDto.skip);
    queryBuilder.take(pageFilterDto.perPage);
    queryBuilder.orderBy(sortBy, OrderReverse[ pageFilterDto.sortDirection ]);


    if (!activeUser.systemAdmin)
    {
        queryBuilder.andWhere(`${role}.organization = :orgId`, { orgId: activeUser.orgId });
    }
    else if (pageFilterDto.organizationId)
    {
        queryBuilder.andWhere(`${role}.organization = :orgId`, { orgId: pageFilterDto.organizationId });
    }


    if (pageFilterDto.allSearch)
    {
        queryBuilder.andWhere(
            new Brackets((qb) =>
            {
                qb.orWhere(`${empl}.firstName ILIKE :search`, { search: `%${pageFilterDto.allSearch}%` });
                qb.orWhere(`${empl}.lastName ILIKE :search`, { search: `%${pageFilterDto.allSearch}%` });
                qb.orWhere(`${empl}.middleName ILIKE :search`, { search: `%${pageFilterDto.allSearch}%` });
                qb.orWhere(`${user}.userName ILIKE :search`, { search: `%${pageFilterDto.allSearch}%` });
                qb.orWhere(`${user}.email ILIKE :search`, { search: `%${pageFilterDto.allSearch}%` });
                qb.orWhere(`${role}.roleName ILIKE :search`, { search: `%${pageFilterDto.allSearch}%` });
                qb.orWhere(`${role}.codeName ILIKE :search`, { search: `%${pageFilterDto.allSearch}%` });
            }),
        );
    }


    return queryBuilder;
}
