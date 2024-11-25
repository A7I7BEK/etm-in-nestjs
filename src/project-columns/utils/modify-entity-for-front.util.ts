import { ProjectColumn } from '../entities/project-column.entity';

/**
 * temporary for this project, must not exist
 */
export function modifyEntityForFront(entity: ProjectColumn)
{
    const { project } = entity;


    if (project)
    {
        Object.assign(entity, {
            projectId: project.id,
            projectName: project.name,
            projectType: {
                name: project.projectType,
                value: project.projectType,
            },
        });
    }


    return entity;
}