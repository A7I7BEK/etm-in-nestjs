import { Repository } from 'typeorm';
import { TaskUpdateDto } from '../dto/task-update.dto';
import { Task } from '../entities/task.entity';


export function updateEntity
    (
        repository: Repository<Task>,
        dto: TaskUpdateDto,
        entity: Task,
    )
{
    entity.name = dto.name;
    entity.description = dto.description;
    entity.level = dto.taskLevelType;
    entity.priority = dto.taskPriorityType;


    return repository.save(entity);
}
