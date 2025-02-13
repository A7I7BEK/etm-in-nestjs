import { Notification } from '../entities/notification.entity';

/**
 * temporary for this project, must not exist
 */
export function modifyEntityForFront(entity: Notification)
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