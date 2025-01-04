import { TaskUpdateDto } from '../dto/task-update.dto';
import { Task } from '../entities/task.entity';
import { TasksService } from '../tasks.service';


export function updateEntity
    (
        service: TasksService,
        dto: TaskUpdateDto,
        entity: Task,
    )
{
    entity.name = dto.name;
    entity.description = dto.description;
    entity.level = dto.taskLevelType;
    entity.priority = dto.taskPriorityType;


    return service.repository.save(entity);
}
