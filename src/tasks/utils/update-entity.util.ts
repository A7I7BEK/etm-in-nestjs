import { Action } from 'src/actions/entities/action.entity';
import { BaseDiffDtoEvent } from 'src/actions/event/base-diff-dto.event';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { TaskUpdateDto } from '../dto/task-update.dto';
import { Task } from '../entities/task.entity';
import { TaskPermissions } from '../enums/task-permissions.enum';
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
            }
        },
        activeUser,
    );
    const oldEntity = structuredClone(entity);


    Object.assign(entity, dto);
    await service.repository.save(entity);


    const actionData: BaseDiffDtoEvent<Task, TaskUpdateDto> = {
        oldEntity,
        dto,
        activeUser,
    };
    service.eventEmitter.emit(
        [ Action.name, TaskPermissions.Update ],
        actionData
    );


    wsEmitOneTask(service, entity.id, activeUser, 'replace');


    return entity;
}
