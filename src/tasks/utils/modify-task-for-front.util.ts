import { Task } from '../entities/task.entity';
import { TaskLevel } from '../enums/task-level.enum';
import { TaskPriority } from '../enums/task-priority.enum';

/**
 * temporary for this project, must not exist
 */
export function modifyTaskForFront(entity: Task)
{
    const { project, column } = entity;


    Object.assign(entity, {
        startAt: entity.createdAt,
        deadLine: entity.endDate,
        taskLevelType: {
            id: entity.level,
            name: TaskLevel[ entity.level ],
            value: TaskLevel[ entity.level ],
        },
        taskPriorityType: {
            id: entity.priority,
            name: TaskPriority[ entity.priority ],
            value: TaskPriority[ entity.priority ],
        },
    });


    if (project)
    {
        Object.assign(entity, {
            projectId: project.id,
            projectName: project.name,
        });
    }


    if (column)
    {
        Object.assign(entity, {
            columnId: column.id,
            columnName: column.name,
        });
    }


    return entity;
}