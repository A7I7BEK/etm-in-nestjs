import { OrderReal } from 'src/common/pagination/order.enum';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { Brackets, Repository } from 'typeorm';
import { ProjectMemberQueryDto } from '../dto/project-member-query.dto';
import { ProjectMember } from '../entities/project-member.entity';


export function loadQueryBuilder(
    repository: Repository<ProjectMember>,
    queryDto: ProjectMemberQueryDto,
    activeUser: ActiveUserData,
)
{
    const [ pMember, empl, user, proj, org ] = [ 'projectMember', 'employee', 'user', 'project', 'organization' ];
    const queryBuilder = repository.createQueryBuilder(pMember);


    queryBuilder.leftJoinAndSelect(`${pMember}.employee`, empl);
    queryBuilder.leftJoinAndSelect(`${empl}.user`, user);
    queryBuilder.select([ // BINGO
        `${pMember}`, // All fields from ProjectMember
        `${empl}`, // All fields from Employee
        `${user}.id`,
        `${user}.userName`, // Only specific fields from User
        `${user}.email`,
        `${user}.phoneNumber`,
    ]);
    queryBuilder.leftJoin(`${pMember}.project`, proj); // BINGO
    queryBuilder.leftJoin(`${proj}.organization`, org); // BINGO
    queryBuilder.skip(queryDto.skip);
    queryBuilder.take(queryDto.perPage);
    queryBuilder.orderBy(pMember + '.' + queryDto.sortBy, OrderReal[ queryDto.sortDirection ]);


    queryBuilder.andWhere(`${pMember}.project = :projId`, { projId: queryDto.projectId });


    if (!activeUser.systemAdmin)
    {
        queryBuilder.andWhere(`${proj}.organization = :orgId`, { orgId: activeUser.orgId });
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
            }),
        );
    }


    return queryBuilder;
}
