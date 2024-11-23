import { ProjectColumn } from '../entities/project-column.entity';

/**
 * temporary for this project, must not exist
 */
export function modifyEntityForFront(entity: ProjectColumn)
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