import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CheckListItem } from 'src/check-list-items/entities/check-list-item.entity';
import { CheckListItemPermissions } from 'src/check-list-items/enums/check-list-item-permissions.enum';
import { ActionsService } from '../actions.service';
import { Action } from '../entities/action.entity';
import { BaseDiffEvent } from '../event/base-diff.event';
import { BaseSimpleEvent } from '../event/base-simple.event';
import { detectChanges } from '../utils/detect-changes.util';


@Injectable()
export class CheckListItemListener
{
    constructor (
        private readonly _service: ActionsService,
    ) { }


    @OnEvent([ Action.name, CheckListItemPermissions.Create ], { async: true })
    listenCreateEvent(data: BaseSimpleEvent<CheckListItem>)
    {
        this.handleCreateDelete(data, CheckListItemPermissions.Create);
        // Tom created checklist item "AAA" in task "BBB"
    }


    @OnEvent([ Action.name, CheckListItemPermissions.Delete ], { async: true })
    listenDeleteEvent(data: BaseSimpleEvent<CheckListItem>)
    {
        this.handleCreateDelete(data, CheckListItemPermissions.Delete);
        // Tom deleted checklist item "AAA" from task "BBB"
    }


    @OnEvent([ Action.name, CheckListItemPermissions.Update ], { async: true })
    async listenUpdateEvent(data: BaseDiffEvent<CheckListItem>)
    {
        const { oldEntity, newEntity, activeUser } = data;

        const action = new Action();
        action.createdAt = new Date();
        action.activityType = CheckListItemPermissions.Update;
        action.task = newEntity.task;
        action.project = newEntity.task.project;
        action.employee = await this._service.getEmployee(activeUser);

        delete newEntity.task;
        const structure = { text: 0, checked: 0 };
        action.details = {
            checkListItem: newEntity,
            changes: detectChanges(oldEntity, newEntity, structure)
        };
        // Tom edited checklist item "AAA" in task "BBB". Changes: ...

        await this._service.repository.save(action);
    }


    private async handleCreateDelete
        (
            data: BaseSimpleEvent<CheckListItem>,
            activityType: CheckListItemPermissions,
        )
    {
        const { entity, activeUser } = data;

        const action = new Action();
        action.createdAt = new Date();
        action.activityType = activityType;
        action.task = entity.task;
        action.project = entity.task.project;
        action.employee = await this._service.getEmployee(activeUser);

        delete entity.task;
        delete entity.checkListGroup;
        action.details = { checkListItem: entity };

        await this._service.repository.save(action);
    }
}