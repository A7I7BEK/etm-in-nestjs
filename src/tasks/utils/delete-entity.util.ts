import { Action } from 'src/actions/entities/action.entity';
import { BaseSimpleEvent } from 'src/actions/event/base-simple.event';
import { reorderItems } from 'src/common/utils/reorder-items.util';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { Task } from '../entities/task.entity';
import { TaskPermissions } from '../enums/task-permissions.enum';
import { TasksService } from '../tasks.service';


export async function deleteEntity
    (
        service: TasksService,
        id: number,
        activeUser: ActiveUserData,
    )
{
    const entity = await service.findOne(
        {
            where: { id },
            relations: {
                project: true,
                column: {
                    tasks: true
                }
            },
            order: {
                column: {
                    tasks: {
                        ordering: 'ASC',
                    }
                }
            }
        },
        activeUser,
    );


    const taskList = entity.column.tasks.filter(a => a.id !== entity.id);
    reorderItems(taskList);
    await service.repository.save(taskList);
    await service.repository.remove(entity);


    entity.id = id;
    delete entity.column.tasks;
    service.tasksGateway.emitDelete(entity, entity.project.id);


    const actionData: BaseSimpleEvent<Task> = {
        entity: structuredClone(entity),
        activeUser,
    };
    service.eventEmitter.emit(
        [ Action.name, TaskPermissions.DELETE ],
        actionData
    );


    return entity;
}
