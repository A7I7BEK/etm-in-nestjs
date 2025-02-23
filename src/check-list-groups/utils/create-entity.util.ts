import { Action } from 'src/actions/entities/action.entity';
import { BaseSimpleEvent } from 'src/actions/event/base-simple.event';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { CheckListGroupsService } from '../check-list-groups.service';
import { CheckListGroupCreateDto } from '../dto/check-list-group-create.dto';
import { CheckListGroup } from '../entities/check-list-group.entity';
import { CheckListGroupPermissions } from '../enums/check-list-group-permissions.enum';


export async function createEntity
    (
        service: CheckListGroupsService,
        dto: CheckListGroupCreateDto,
        activeUser: ActiveUserData,
    )
{
    const entity = new CheckListGroup();


    entity.task = await service.tasksService.findOne(
        {
            where: { id: dto.taskId },
            relations: {
                project: true,
            }
        },
        activeUser,
    );


    entity.name = dto.name;
    await service.repository.save(entity);


    const actionData: BaseSimpleEvent<CheckListGroup> = {
        entity,
        activeUser,
    };
    service.eventEmitter.emit(
        [ Action.name, CheckListGroupPermissions.CREATE ],
        actionData
    );


    return entity;
}
