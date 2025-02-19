import { Role } from '../entity/role.entity';

/**
 * temporary for this project, must not exist
 */
export function modifyEntityForFront(entity: Role)
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