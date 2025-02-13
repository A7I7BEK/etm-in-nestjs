import { Action } from 'src/actions/entities/action.entity';
import { BaseSimpleEvent } from 'src/actions/event/base-simple.event';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { wsEmitOneTask } from 'src/tasks/utils/ws-emit-one-task.util';
import { In } from 'typeorm';
import { CheckListItemsService } from '../check-list-items.service';
import { CheckListItemCreateDto } from '../dto/check-list-item-create.dto';
import { CheckListItem } from '../entities/check-list-item.entity';
import { CheckListItemPermissions } from '../enums/check-list-item-permissions.enum';


export async function createEntity
    (
        service: CheckListItemsService,
        dto: CheckListItemCreateDto,
        activeUser: ActiveUserData,
    )
{
    const entity = new CheckListItem();


    entity.checkListGroup = await service.chGroupsService.findOne(
        {
            where: { id: dto.checkListGroupId },
            relations: {
                task: {
                    project: true,
                }
            }
        },
        activeUser,
    );
    entity.task = entity.checkListGroup.task;


    const memberIds = dto.members.map(x => x.id);
    entity.members = await service.employeesService.findAll(
        {
            where: { id: In(memberIds) }
        },
        activeUser,
    );


    entity.text = dto.text;
    await service.repository.save(entity);


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
        [ Action.name, CheckListItemPermissions.Create ],
        actionData
    );


    return entity;
}
