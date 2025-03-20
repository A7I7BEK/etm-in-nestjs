import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CheckListGroup } from 'src/check-list-groups/entities/check-list-group.entity';
import { CheckListGroupPermissions } from 'src/check-list-groups/enums/check-list-group-permissions.enum';
import { ActionsService } from '../actions.service';
import { Action } from '../entities/action.entity';
import { BaseDiffEvent } from '../event/base-diff.event';
import { BaseSimpleEvent } from '../event/base-simple.event';
import { detectChanges } from '../utils/detect-changes.util';


@Injectable()
export class CheckListGroupListener
{
    constructor (
        private readonly _service: ActionsService,
    ) { }


    @OnEvent([ Action.name, CheckListGroupPermissions.CREATE ], { async: true })
    listenCreateEvent(data: BaseSimpleEvent<CheckListGroup>)
    {
        this.handleCreateDelete(data, CheckListGroupPermissions.CREATE);
        // Tom created checklist group "AAA" in task "BBB"
    }


    @OnEvent([ Action.name, CheckListGroupPermissions.DELETE ], { async: true })
    listenDeleteEvent(data: BaseSimpleEvent<CheckListGroup>)
    {
        this.handleCreateDelete(data, CheckListGroupPermissions.DELETE);
        // Tom deleted checklist group "AAA" from task "BBB"
    }


    @OnEvent([ Action.name, CheckListGroupPermissions.UPDATE ], { async: true })
    async listenUpdateEvent(data: BaseDiffEvent<CheckListGroup>)
    {
        const { oldEntity, newEntity, activeUser } = data;

        const action = new Action();
        action.createdAt = new Date();
        action.activityType = CheckListGroupPermissions.UPDATE;
        action.task = newEntity.task;
        action.project = newEntity.task.project;
        action.employee = await this._service.getEmployee(activeUser);

        delete newEntity.task;
        const structure = { name: 0 };
        action.details = {
            checkListGroup: newEntity,
            changes: detectChanges(oldEntity, newEntity, structure)
        };
        // Tom edited checklist group "AAA" in task "BBB". Changes: ...

        this._service.saveAction(action);
    }


    private async handleCreateDelete
        (
            data: BaseSimpleEvent<CheckListGroup>,
            activityType: CheckListGroupPermissions,
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
        action.details = { checkListGroup: entity };

        this._service.saveAction(action);
    }
}