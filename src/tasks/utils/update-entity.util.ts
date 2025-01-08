import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { TaskUpdateDto } from '../dto/task-update.dto';
import { TasksService } from '../tasks.service';
import { wsEmitOneTask } from './ws-emit-one-task.util';


export async function updateEntity
    (
        service: TasksService,
        id: number,
        dto: TaskUpdateDto,
        activeUser: ActiveUserData,
    )
{
    const entity = await service.findOne(
        {
            where: { id },
            relations: {
                project: true,
            },
        },
        activeUser,
    );


    entity.name = dto.name;
    entity.description = dto.description;
    entity.level = dto.taskLevelType;
    entity.priority = dto.taskPriorityType;
    await service.repository.save(entity);


    wsEmitOneTask(
        service,
        entity.id,
        entity.project.id,
        activeUser,
        'replace',
    );


    return entity;
}
