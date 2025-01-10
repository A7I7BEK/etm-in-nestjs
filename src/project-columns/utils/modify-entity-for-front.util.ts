import { ProjectColumn } from '../entities/project-column.entity';

/**
 * temporary for this project, must not exist
 */
export function modifyProjectColumnForFront(entity: ProjectColumn)
{
    const { project } = entity;


    Object.assign(entity, {
        projectType: {
            name: entity.projectType,
            value: entity.projectType,
        },
    });


    if (project)
    {
        Object.assign(entity, {
            projectId: project.id,
            projectName: project.name,
        });
    }


    return entity;
}