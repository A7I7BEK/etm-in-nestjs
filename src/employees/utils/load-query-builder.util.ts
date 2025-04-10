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
    const [ empl, photo, user, org, role, members ] =
        [ 'employee', 'photo', 'user', 'organization', 'role', 'members' ];


    // BINGO: bypass the type check using <any>
    const sortBy = (<any>Object)
        .values(EmployeeProperties)
        .includes(queryDto.sortBy)
        ? empl + '.' + queryDto.sortBy
        : user + '.' + queryDto.sortBy;


    const queryBuilder = repository.createQueryBuilder(empl);
    queryBuilder.leftJoinAndSelect(`${empl}.photoFile`, photo);
    queryBuilder.leftJoinAndSelect(`${empl}.user`, user);
    queryBuilder.leftJoinAndSelect(`${user}.organization`, org);
    queryBuilder.leftJoinAndSelect(`${user}.roles`, role);
    queryBuilder.leftJoin(`${empl}.members`, members);
    queryBuilder.skip(queryDto.skip);
    queryBuilder.take(queryDto.pageSize);
    queryBuilder.orderBy(sortBy, queryDto.order);


    if (!activeUser.systemAdmin)
    {
        queryBuilder.andWhere(`${user}.organization = :orgId`, { orgId: activeUser.orgId });
    }
    else if (queryDto.organizationId)
    {
        queryBuilder.andWhere(`${user}.organization = :orgId`, { orgId: queryDto.organizationId });
    }


    if (queryDto.projectId)
    {
        queryBuilder.andWhere(`${members}.project = :prId`, { prId: queryDto.projectId });
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
                qb.orWhere(`${role}.name ILIKE :search`, { search: `%${queryDto.allSearch}%` });
            }),
        );
    }


    return queryBuilder;
}
