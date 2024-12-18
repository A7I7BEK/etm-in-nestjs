import { TaskTimer } from '../entities/task-timer.entity';

/**
 * temporary for this project, must not exist
 */
export function modifyEntityForFront(entity: TaskTimer)
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