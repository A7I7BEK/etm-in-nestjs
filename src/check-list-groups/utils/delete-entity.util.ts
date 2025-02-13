import { Action } from 'src/actions/entities/action.entity';
import { BaseSimpleEvent } from 'src/actions/event/base-simple.event';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { CheckListGroupsService } from '../check-list-groups.service';
import { CheckListGroup } from '../entities/check-list-group.entity';
import { CheckListGroupPermissions } from '../enums/check-list-group-permissions.enum';


export async function deleteEntity
    (
        service: CheckListGroupsService,
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


    const actionData: BaseSimpleEvent<CheckListGroup> = {
        entity,
        activeUser,
    };
    service.eventEmitter.emit(
        [ Action.name, CheckListGroupPermissions.Delete ],
        actionData
    );


    return entity;
}
