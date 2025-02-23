import { Action } from 'src/actions/entities/action.entity';
import { BaseDiffEvent } from 'src/actions/event/base-diff.event';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { wsEmitOneTask } from 'src/tasks/utils/ws-emit-one-task.util';
import { CheckListItemsService } from '../check-list-items.service';
import { CheckListItemUpdateDto } from '../dto/check-list-item-update.dto';
import { CheckListItem } from '../entities/check-list-item.entity';
import { CheckListItemPermissions } from '../enums/check-list-item-permissions.enum';


export async function updateEntity
    (
        service: CheckListItemsService,
        dto: CheckListItemUpdateDto,
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
    const oldEntity = structuredClone(entity);


    entity.checked = dto.checked;
    entity.text = dto.text;
    await service.repository.save(entity);


    wsEmitOneTask(
        service.tasksService,
        entity.task.id,
        activeUser,
        'replace',
    );


    const actionData: BaseDiffEvent<CheckListItem> = {
        oldEntity,
        newEntity: entity,
        activeUser,
    };
    service.eventEmitter.emit(
        [ Action.name, CheckListItemPermissions.UPDATE ],
        actionData
    );


    return entity;
}
