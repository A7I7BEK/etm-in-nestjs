import { Task } from '../entities/task.entity';
import { TaskLevel } from '../enums/task-level.enum';
import { TaskPriority } from '../enums/task-priority.enum';

/**
 * temporary for this project, must not exist
 */
export function modifyTaskForFront(entity: Task)
{
    const { level, priority, project, column } = entity;


    Object.assign(entity, {
        startAt: entity.createdAt,
        deadLine: entity.endDate,
    });


    if (level)
    {
        Object.assign(entity, {
            taskLevelType: {
                id: level,
                name: TaskLevel[ level ],
                value: TaskLevel[ level ],
            },
        });
    }


    if (priority)
    {
        Object.assign(entity, {
            taskPriorityType: {
                id: priority,
                name: TaskPriority[ priority ],
                value: TaskPriority[ priority ],
            },
        });
    }


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