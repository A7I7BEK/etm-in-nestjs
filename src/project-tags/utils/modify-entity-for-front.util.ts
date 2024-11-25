import { ProjectTag } from '../entities/project-tag.entity';

/**
 * temporary for this project, must not exist
 */
export function modifyEntityForFront(entity: ProjectTag)
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