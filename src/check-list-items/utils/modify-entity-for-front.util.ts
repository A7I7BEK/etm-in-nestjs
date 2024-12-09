import { CheckListItem } from '../entities/check-list-item.entity';

/**
 * temporary for this project, must not exist
 */
export function modifyEntityForFront(entity: CheckListItem)
{
    const { organization } = entity;


    if (organization)
    {
        Object.assign(entity, {
            organizationId: organization.id,
            organizationName: organization.name,
        });
    }


    return entity;
}