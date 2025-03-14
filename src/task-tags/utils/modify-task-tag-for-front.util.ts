import { TaskTag } from '../entities/task-tag.entity';

/**
 * temporary for this project, must not exist
 */
export function modifyTaskTagForFront(entity: TaskTag)
{
    const { projectTag } = entity;


    if (projectTag)
    {
        Object.assign(entity, {
            projectTagId: projectTag.id,
            name: projectTag.name,
            color: projectTag.color,
        });
    }


    return entity;
}