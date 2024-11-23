import { OrderReverse } from 'src/common/pagination/order.enum';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { Brackets, Repository } from 'typeorm';
import { EmployeeQueryDto } from '../dto/employee-query.dto';
import { Employee } from '../entities/employee.entity';
import { EmployeeProperties } from '../enums/employee-properties.enum';


export function loadQueryBuilder(
    repository: Repository<Employee>,
    queryDto: EmployeeQueryDto,
    activeUser: ActiveUserData,
)
{
    const [ empl, user, org, role ] = [ 'employee', 'user', 'organization', 'role' ];

    // BINGO
    const sortBy = (<any>Object)
        .values(EmployeeProperties)
        .includes(queryDto.sortBy)
        ? empl + '.' + queryDto.sortBy
        : user + '.' + queryDto.sortBy;


    const queryBuilder = repository.createQueryBuilder(empl);
    queryBuilder.leftJoinAndSelect(`${empl}.user`, user);
    queryBuilder.leftJoinAndSelect(`${user}.organization`, org);
    queryBuilder.leftJoinAndSelect(`${user}.roles`, role);
    queryBuilder.skip(queryDto.skip);
    queryBuilder.take(queryDto.perPage);
    queryBuilder.orderBy(sortBy, OrderReverse[ queryDto.sortDirection ]);


    if (!activeUser.systemAdmin)
    {
        queryBuilder.andWhere(`${role}.organization = :orgId`, { orgId: activeUser.orgId });
    }
    else if (queryDto.organizationId)
    {
        queryBuilder.andWhere(`${role}.organization = :orgId`, { orgId: queryDto.organizationId });
    }


    if (queryDto.allSearch)
    {
        queryBuilder.andWhere(
            new Brackets((qb) =>
            {
                qb.orWhere(`${empl}.firstName ILIKE :search`, { search: `%${queryDto.allSearch}%` });
                qb.orWhere(`${empl}.lastName ILIKE :search`, { search: `%${queryDto.allSearch}%` });
                qb.orWhere(`${empl}.middleName ILIKE :search`, { search: `%${queryDto.allSearch}%` });
                qb.orWhere(`${user}.userName ILIKE :search`, { search: `%${queryDto.allSearch}%` });
                qb.orWhere(`${user}.email ILIKE :search`, { search: `%${queryDto.allSearch}%` });
                qb.orWhere(`${role}.roleName ILIKE :search`, { search: `%${queryDto.allSearch}%` });
                qb.orWhere(`${role}.codeName ILIKE :search`, { search: `%${queryDto.allSearch}%` });
            }),
        );
    }


    return queryBuilder;
}
