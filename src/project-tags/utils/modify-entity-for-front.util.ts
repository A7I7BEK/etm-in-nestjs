import { ProjectTag } from '../entities/project-tag.entity';

/**
 * temporary for this project, must not exist
 */
export function modifyEntityForFront(entity: ProjectTag)
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