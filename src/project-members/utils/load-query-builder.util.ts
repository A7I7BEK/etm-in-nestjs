import { OrderReverse } from 'src/common/pagination/order.enum';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { Brackets, Repository } from 'typeorm';
import { ProjectMemberPageFilterDto } from '../dto/project-member-page-filter.dto';
import { ProjectMember } from '../entities/project-member.entity';


export function loadQueryBuilder(
    repository: Repository<ProjectMember>,
    pageFilterDto: ProjectMemberPageFilterDto,
    activeUser: ActiveUserData,
)
{
    const [ pMember, empl, user, proj, org ] = [ 'projectMember', 'employee', 'user', 'project', 'organization' ];
    const queryBuilder = repository.createQueryBuilder(pMember);


    queryBuilder.leftJoinAndSelect(`${pMember}.employee`, empl);
    queryBuilder.leftJoinAndSelect(`${empl}.user`, user).select([ // TODO: check
        `${user}.id`,
        `${user}.userName`,
        `${user}.email`,
        `${user}.phoneNumber`,
    ]);
    queryBuilder.leftJoinAndSelect(`${pMember}.project`, proj);
    queryBuilder.leftJoinAndSelect(`${proj}.organization`, org);
    queryBuilder.skip(pageFilterDto.skip);
    queryBuilder.take(pageFilterDto.perPage);
    queryBuilder.orderBy(pMember + '.' + pageFilterDto.sortBy, OrderReverse[ pageFilterDto.sortDirection ]);


    queryBuilder.andWhere(`${pMember}.project = :projId`, { projId: pageFilterDto.projectId });


    if (!activeUser.systemAdmin)
    {
        queryBuilder.andWhere(`${proj}.organization = :orgId`, { orgId: activeUser.orgId });
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
            }),
        );
    }


    return queryBuilder;
}
