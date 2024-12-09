import { CheckListGroup } from '../entities/check-list-group.entity';

/**
 * temporary for this project, must not exist
 */
export function modifyEntityForFront(entity: CheckListGroup)
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