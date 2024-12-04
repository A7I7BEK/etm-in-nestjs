import { TaskMember } from '../entities/task-member.entity';

/**
 * temporary for this project, must not exist
 */
export function modifyEntityForFront(entity: TaskMember)
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