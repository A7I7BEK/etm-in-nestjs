import { Action } from 'src/actions/entities/action.entity';
import { BaseSimpleEvent } from 'src/actions/event/base-simple.event';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { wsEmitOneTask } from 'src/tasks/utils/ws-emit-one-task.util';
import { CheckListItemsService } from '../check-list-items.service';
import { CheckListItem } from '../entities/check-list-item.entity';
import { CheckListItemPermissions } from '../enums/check-list-item-permissions.enum';


export async function deleteEntity
    (
        service: CheckListItemsService,
        id: number,
        activeUser: ActiveUserData,
    )
{
    const entity = await service.findOne(
        {
            where: { id },
            relations: {
                task: {
                    project: true,
                },
            }
        },
        activeUser,
    );
    await service.repository.remove(entity);


    wsEmitOneTask(
        service.tasksService,
        entity.task.id,
        activeUser,
        'replace',
    );


    const actionData: BaseSimpleEvent<CheckListItem> = {
        entity,
        activeUser,
    };
    service.eventEmitter.emit(
        [ Action.name, CheckListItemPermissions.DELETE ],
        actionData
    );


    return entity;
}
