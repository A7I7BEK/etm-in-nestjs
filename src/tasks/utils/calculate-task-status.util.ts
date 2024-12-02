import { Task } from '../entities/task.entity';
import { TaskStatus } from '../enums/task-status.enum';

const ONE_DAY = 1000 * 60 * 60 * 24; // 24 hour

export function calculateTaskStatus(entity: Task)
{
    if (!entity.endDate)
    {
        entity[ 'status' ] = TaskStatus.BLUE;
    }
    else if (Date.now() > entity.endDate.getTime())
    {
        entity[ 'status' ] = TaskStatus.RED;
    }
    else if (ONE_DAY > Date.now() - entity.endDate.getTime())
    {
        entity[ 'status' ] = TaskStatus.YELLOW;
    }
    else
    {
        entity[ 'status' ] = TaskStatus.GREEN;
    }


    return entity;
}
