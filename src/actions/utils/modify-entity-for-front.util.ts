import { Action } from '../entities/action.entity';

/**
 * temporary for this project, must not exist
 */
export function modifyEntityForFront(entity: Action)
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