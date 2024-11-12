import { OrderReverse } from 'src/common/pagination/order.enum';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { Brackets, Repository } from 'typeorm';
import { ProjectPageFilterDto } from '../dto/project-page-filter.dto';
import { Project } from '../entities/project.entity';


export function loadQueryBuilder(
    repository: Repository<Project>,
    pageFilterDto: ProjectPageFilterDto,
    activeUser: ActiveUserData,
)
{
    const [ project, group, manager, org ] = [ 'project', 'group', 'manager', 'organization' ];

    const queryBuilder = repository.createQueryBuilder(project);
    queryBuilder.leftJoinAndSelect(`${project}.group`, group);
    queryBuilder.leftJoinAndSelect(`${group}.employees`, 'employees');
    queryBuilder.leftJoinAndSelect(`${group}.leader`, 'leader');
    queryBuilder.leftJoinAndSelect(`${project}.manager`, manager);
    queryBuilder.leftJoinAndSelect(`${project}.organization`, org);
    queryBuilder.skip(pageFilterDto.skip);
    queryBuilder.take(pageFilterDto.perPage);
    queryBuilder.orderBy(project + '.' + pageFilterDto.sortBy, OrderReverse[ pageFilterDto.sortDirection ]);

    if (pageFilterDto.projectType)
    {
        queryBuilder.andWhere(`${project}.projectType = :prType`, { prType: pageFilterDto.projectType });
    }

    if (pageFilterDto.groupId)
    {
        queryBuilder.andWhere(`${project}.group = :grId`, { grId: pageFilterDto.groupId });
    }

    if (pageFilterDto.managerId)
    {
        queryBuilder.andWhere(`${project}.manager = :manId`, { manId: pageFilterDto.managerId });
    }


    if (!activeUser.systemAdmin)
    {
        queryBuilder.andWhere(`${project}.organization = :orgId`, { orgId: activeUser.orgId });
    }
    else if (pageFilterDto.organizationId)
    {
        queryBuilder.andWhere(`${project}.organization = :orgId`, { orgId: pageFilterDto.organizationId });
    }


    if (pageFilterDto.allSearch)
    {
        queryBuilder.andWhere(
            new Brackets((qb) =>
            {
                qb.orWhere(`${project}.name ILIKE :search`, { search: `%${pageFilterDto.allSearch}%` });
                qb.orWhere(`${project}.codeName ILIKE :search`, { search: `%${pageFilterDto.allSearch}%` });
                qb.orWhere(`${group}.name ILIKE :search`, { search: `%${pageFilterDto.allSearch}%` });
                qb.orWhere(`${manager}.firstName ILIKE :search`, { search: `%${pageFilterDto.allSearch}%` });
                qb.orWhere(`${manager}.lastName ILIKE :search`, { search: `%${pageFilterDto.allSearch}%` });
                qb.orWhere(`${manager}.middleName ILIKE :search`, { search: `%${pageFilterDto.allSearch}%` });
            }),
        );
    }


    return queryBuilder;
};
