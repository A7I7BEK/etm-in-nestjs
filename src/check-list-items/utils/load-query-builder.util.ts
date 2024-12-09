import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { Brackets, Repository } from 'typeorm';
import { CheckListItemQueryDto } from '../dto/check-list-item-query.dto';
import { CheckListItem } from '../entities/check-list-item.entity';


export function loadQueryBuilder
    (
        repository: Repository<CheckListItem>,
        queryDto: CheckListItemQueryDto,
        activeUser: ActiveUserData,
    )
{
    const [ checkItem, checkGroup, members, user, task, proj, org ] =
        [ 'checkListItem', 'checkListGroup', 'members', 'user', 'task', 'project', 'organization' ];
    const queryBuilder = repository.createQueryBuilder(checkItem);


    queryBuilder.leftJoinAndSelect(`${checkItem}.checkListGroup`, checkGroup);
    queryBuilder.leftJoinAndSelect(`${checkItem}.members`, members);
    queryBuilder.leftJoinAndSelect(`${members}.user`, user);
    queryBuilder.leftJoin(`${checkItem}.task`, task);
    queryBuilder.leftJoin(`${task}.project`, proj);
    queryBuilder.leftJoin(`${proj}.organization`, org);
    queryBuilder.skip(queryDto.skip);
    queryBuilder.take(queryDto.perPage);
    queryBuilder.orderBy(checkItem + '.' + queryDto.sortBy, queryDto.order);


    queryBuilder.andWhere(`${checkItem}.checkListGroup = :chGrId`, { chGrId: queryDto.checkListGroupId });


    if (!activeUser.systemAdmin)
    {
        queryBuilder.andWhere(`${proj}.organization = :orgId`, { orgId: activeUser.orgId });
    }


    if (queryDto.allSearch)
    {
        queryBuilder.andWhere(
            new Brackets((qb) =>
            {
                qb.orWhere(`${checkItem}.text ILIKE :search`, { search: `%${queryDto.allSearch}%` });
                qb.orWhere(`${checkGroup}.name ILIKE :search`, { search: `%${queryDto.allSearch}%` });
            }),
        );
    }


    return queryBuilder;
}
