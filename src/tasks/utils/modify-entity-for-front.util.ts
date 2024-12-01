import { Task } from '../entities/task.entity';

/**
 * temporary for this project, must not exist
 */
export function modifyEntityForFront(entity: Task)
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