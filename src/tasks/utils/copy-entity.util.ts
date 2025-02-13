import { Action } from 'src/actions/entities/action.entity';
import { BaseDiffEvent } from 'src/actions/event/base-diff.event';
import { reOrderItems } from 'src/common/utils/re-order-items.util';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { TaskCopyDto } from '../dto/task-copy.dto';
import { Task } from '../entities/task.entity';
import { TaskPermissions } from '../enums/task-permissions.enum';
import { TasksService } from '../tasks.service';
import { wsEmitOneTask } from './ws-emit-one-task.util';


export async function copyEntity
    (
        service: TasksService,
        copyDto: TaskCopyDto,
        activeUser: ActiveUserData,
    )
{
    const taskEntity = await service.findOne(
        {
            where: { id: copyDto.id },
        },
        activeUser,
    );


    const columnEntity = await service.columnsService.findOne(
        {
            where: {
                id: copyDto.columnId,
                project: {
                    id: copyDto.projectId,
                }
            },
            relations: {
                project: true,
                tasks: true,
            },
            order: {
                tasks: {
                    ordering: 'ASC',
                }
            },
        },
        activeUser,
    );


    const entity = new Task();
    Object.assign(entity, taskEntity);
    delete entity.id;
    delete entity.startDate;
    delete entity.endDate;
    delete entity.timeEntryType;
    delete entity.totalTimeSpent;

    entity.name = copyDto.name;
    entity.column = { ...columnEntity };
    delete entity.column.tasks;
    entity.project = columnEntity.project;
    entity.ordering = 0;
    entity.createdAt = new Date();
    await service.repository.save(entity);


    columnEntity.tasks.splice(copyDto.ordering, 0, entity);
    reOrderItems(columnEntity.tasks);
    await service.repository.save(columnEntity.tasks);


    const actionData: BaseDiffEvent<Task> = {
        oldEntity: taskEntity,
        newEntity: entity,
        activeUser,
    };
    service.eventEmitter.emit(
        [ Action.name, TaskPermissions.Copy ],
        actionData
    );


    wsEmitOneTask(service, entity.id, activeUser, 'insert');


    return entity;
}
