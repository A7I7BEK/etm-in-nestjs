import { Action } from 'src/actions/entities/action.entity';
import { BaseDiffEvent } from 'src/actions/event/base-diff.event';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { CheckListGroupsService } from '../check-list-groups.service';
import { CheckListGroupUpdateDto } from '../dto/check-list-group-update.dto';
import { CheckListGroup } from '../entities/check-list-group.entity';
import { CheckListGroupPermissions } from '../enums/check-list-group-permissions.enum';


export async function updateEntity
    (
        service: CheckListGroupsService,
        dto: CheckListGroupUpdateDto,
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


    entity.name = dto.name;
    await service.repository.save(entity);


    const actionData: BaseDiffEvent<CheckListGroup> = {
        oldEntity,
        newEntity: structuredClone(entity),
        activeUser,
    };
    service.eventEmitter.emit(
        [ Action.name, CheckListGroupPermissions.UPDATE ],
        actionData
    );


    return entity;
}
