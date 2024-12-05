import { TaskComment } from '../entities/task-comment.entity';

/**
 * temporary for this project, must not exist
 */
export function modifyEntityForFront(entity: TaskComment)
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