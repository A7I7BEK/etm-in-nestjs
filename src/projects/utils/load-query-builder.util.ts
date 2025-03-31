import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { Brackets, Repository } from 'typeorm';
import { ProjectQueryDto } from '../dto/project-query.dto';
import { Project } from '../entities/project.entity';


export function loadQueryBuilder
    (
        repository: Repository<Project>,
        queryDto: ProjectQueryDto,
        activeUser: ActiveUserData,
    )
{
    const [ project, group, manager, mPhoto, org, tasks, tColumn ] =
        [ 'project', 'group', 'manager', 'mPhoto', 'organization', 'tasks', 'column' ];
    const queryBuilder = repository.createQueryBuilder(project);


    queryBuilder.leftJoinAndSelect(`${project}.group`, group);
    queryBuilder.leftJoinAndSelect(`${project}.manager`, manager);
    queryBuilder.leftJoinAndSelect(`${manager}.photoFile`, mPhoto);
    queryBuilder.leftJoinAndSelect(`${project}.organization`, org);
    queryBuilder.leftJoinAndSelect(`${project}.tasks`, tasks);
    queryBuilder.leftJoinAndSelect(`${tasks}.column`, tColumn);
    queryBuilder.skip(queryDto.skip);
    queryBuilder.take(queryDto.pageSize);
    queryBuilder.orderBy(project + '.' + queryDto.sortBy, queryDto.order);


    if (queryDto.projectType)
    {
        queryBuilder.andWhere(`${project}.projectType = :prType`, { prType: queryDto.projectType });
    }


    if (queryDto.groupId)
    {
        queryBuilder.andWhere(`${project}.group = :grId`, { grId: queryDto.groupId });
    }


    if (queryDto.managerId)
    {
        queryBuilder.andWhere(`${project}.manager = :manId`, { manId: queryDto.managerId });
    }


    if (!activeUser.systemAdmin)
    {
        queryBuilder.andWhere(`${project}.organization = :orgId`, { orgId: activeUser.orgId });
    }
    else if (queryDto.organizationId)
    {
        queryBuilder.andWhere(`${project}.organization = :orgId`, { orgId: queryDto.organizationId });
    }


    if (queryDto.allSearch)
    {
        queryBuilder.andWhere(
            new Brackets((qb) =>
            {
                qb.orWhere(`${project}.name ILIKE :search`, { search: `%${queryDto.allSearch}%` });
                qb.orWhere(`${group}.name ILIKE :search`, { search: `%${queryDto.allSearch}%` });
                qb.orWhere(`${manager}.firstName ILIKE :search`, { search: `%${queryDto.allSearch}%` });
                qb.orWhere(`${manager}.lastName ILIKE :search`, { search: `%${queryDto.allSearch}%` });
                qb.orWhere(`${manager}.middleName ILIKE :search`, { search: `%${queryDto.allSearch}%` });
            }),
        );
    }


    return queryBuilder;
};
