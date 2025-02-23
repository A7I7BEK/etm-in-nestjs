import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { Brackets, Repository } from 'typeorm';
import { ProjectTagQueryDto } from '../dto/project-tag-query.dto';
import { ProjectTag } from '../entities/project-tag.entity';


export function loadQueryBuilder
    (
        repository: Repository<ProjectTag>,
        queryDto: ProjectTagQueryDto,
        activeUser: ActiveUserData,
    )
{
    const [ pTag, proj, org ] = [ 'projectTag', 'project', 'organization' ];
    const queryBuilder = repository.createQueryBuilder(pTag);


    queryBuilder.leftJoinAndSelect(`${pTag}.project`, proj);
    queryBuilder.leftJoinAndSelect(`${proj}.organization`, org);
    queryBuilder.skip(queryDto.skip);
    queryBuilder.take(queryDto.pageSize);
    queryBuilder.orderBy(pTag + '.' + queryDto.sortBy, queryDto.order);


    queryBuilder.andWhere(`${pTag}.project = :projId`, { projId: queryDto.projectId });


    if (!activeUser.systemAdmin)
    {
        queryBuilder.andWhere(`${proj}.organization = :orgId`, { orgId: activeUser.orgId });
    }


    if (queryDto.allSearch)
    {
        queryBuilder.andWhere(
            new Brackets((qb) =>
            {
                qb.orWhere(`${pTag}.name ILIKE :search`, { search: `%${queryDto.allSearch}%` });
            }),
        );
    }


    return queryBuilder;
}
