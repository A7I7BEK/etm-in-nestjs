import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CheckListItem } from 'src/check-list-items/entities/check-list-item.entity';
import { CheckListItemPermissions } from 'src/check-list-items/enums/check-list-item-permissions.enum';
import { Notification } from 'src/notifications/entities/notification.entity';
import { NotificationType } from 'src/notifications/enums/notification-type.enum';
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


    @OnEvent([ Action.name, CheckListItemPermissions.CREATE ], { async: true })
    async listenCreateEvent(data: BaseSimpleEvent<CheckListItem>)
    {
        const { entity, activeUser } = data;

        const action = new Action();
        action.createdAt = new Date();
        action.activityType = CheckListItemPermissions.CREATE;
        action.task = entity.task;
        action.project = entity.task.project;
        action.employee = await this._service.getEmployee(activeUser);

        const { employees } = entity;
        delete entity.employees;
        delete entity.task;
        delete entity.checkListGroup;
        action.details = { checkListItem: entity };
        // Tom created checklist item "AAA" in task "BBB"

        await this._service.repository.save(action);

        this._service.eventEmitter.emit(
            [ Notification.name, NotificationType.CHECK_LIST_ITEM ],
            employees,
            action,
        );
    }


    @OnEvent([ Action.name, CheckListItemPermissions.DELETE ], { async: true })
    async listenDeleteEvent(data: BaseSimpleEvent<CheckListItem>)
    {
        const { entity, activeUser } = data;

        const action = new Action();
        action.createdAt = new Date();
        action.activityType = CheckListItemPermissions.DELETE;
        action.task = entity.task;
        action.project = entity.task.project;
        action.employee = await this._service.getEmployee(activeUser);

        delete entity.task;
        delete entity.checkListGroup;
        action.details = { checkListItem: entity };
        // Tom deleted checklist item "AAA" from task "BBB"

        await this._service.repository.save(action);
    }


    @OnEvent([ Action.name, CheckListItemPermissions.UPDATE ], { async: true })
    async listenUpdateEvent(data: BaseDiffEvent<CheckListItem>)
    {
        const { oldEntity, newEntity, activeUser } = data;

        const action = new Action();
        action.createdAt = new Date();
        action.activityType = CheckListItemPermissions.UPDATE;
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
}