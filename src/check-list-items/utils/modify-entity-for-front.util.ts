import { CheckListItem } from '../entities/check-list-item.entity';

/**
 * temporary for this project, must not exist
 */
export function modifyEntityForFront(entity: CheckListItem)
{
    const { members, checkListGroup } = entity;


    if (members)
    {
        members.forEach(item =>
        {
            Object.assign(item, {
                employee: {
                    firstName: item.firstName,
                    lastName: item.lastName,
                    middleName: item.middleName,
                    userId: item.user?.id,
                    userName: item.user?.userName,
                }
            });
        });
    }


    if (checkListGroup)
    {
        Object.assign(entity, {
            checkListGroupId: checkListGroup.id,
            checkListGroupName: checkListGroup.name,
        });
    }


    return entity;
}