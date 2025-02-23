import { Task } from '../entities/task.entity';
import { calculateTaskStatus } from './calculate-task-status.util';

/**
 * temporary for this project, must not exist
 */
export function modifyTaskForFront(entity: Task)
{
    Object.assign(entity, {
        projectId: entity?.project?.id,
        projectName: entity?.project?.name,
        columnId: entity?.column?.id,
        columnName: entity?.column?.name,
    });


    calculateTaskStatus(entity);


    return entity;
}