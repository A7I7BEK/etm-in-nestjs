import { TaskTag } from '../entities/task-tag.entity';

/**
 * temporary for this project, must not exist
 */
export function modifyEntityForFront(entity: TaskTag)
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