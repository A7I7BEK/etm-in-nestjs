import { TaskDeadline } from '../entities/task-deadline.entity';

/**
 * temporary for this project, must not exist
 */
export function modifyEntityForFront(entity: TaskDeadline)
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