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
    const [ pMember, empl, photo, user, proj, org ] =
        [ 'projectMember', 'employee', 'photo', 'user', 'project', 'organization' ];
    const queryBuilder = repository.createQueryBuilder(pMember);


    queryBuilder.leftJoinAndSelect(`${pMember}.employee`, empl);
    queryBuilder.leftJoinAndSelect(`${empl}.photoFile`, photo);
    queryBuilder.leftJoin(`${empl}.user`, user);
    queryBuilder.addSelect([ // BINGO: select only needed fields
        `${user}.id`,
        `${user}.userName`,
        `${user}.email`,
        `${user}.phoneNumber`,
    ]);
    queryBuilder.leftJoin(`${pMember}.project`, proj); // BINGO: join but not select
    queryBuilder.leftJoin(`${proj}.organization`, org); // BINGO: join but not select
    queryBuilder.skip(queryDto.skip);
    queryBuilder.take(queryDto.pageSize);
    queryBuilder.orderBy(pMember + '.' + queryDto.sortBy, queryDto.order);


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
