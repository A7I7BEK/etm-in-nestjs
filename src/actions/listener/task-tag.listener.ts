import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TaskTag } from 'src/task-tags/entities/task-tag.entity';
import { TaskTagPermissions } from 'src/task-tags/enums/task-tag-permissions.enum';
import { ActionsService } from '../actions.service';
import { Action } from '../entities/action.entity';
import { BaseSimpleEvent } from '../event/base-simple.event';


@Injectable()
export class TaskTagListener
{
    constructor (
        private readonly _service: ActionsService,
    ) { }


    @OnEvent([ Action.name, TaskTagPermissions.CREATE ], { async: true })
    listenCreateEvent(data: BaseSimpleEvent<TaskTag>)
    {
        this.handleAllEvents(data, TaskTagPermissions.CREATE);
        // Tom added tag "AAA" into task "BBB"
    }


    @OnEvent([ Action.name, TaskTagPermissions.DELETE ], { async: true })
    listenDeleteEvent(data: BaseSimpleEvent<TaskTag>)
    {
        this.handleAllEvents(data, TaskTagPermissions.DELETE);
        // Tom removed tag "AAA" from task "BBB"
    }


    private async handleAllEvents
        (
            data: BaseSimpleEvent<TaskTag>,
            activityType: TaskTagPermissions,
        )
    {
        const { entity, activeUser } = data;

        const action = new Action();
        action.createdAt = new Date();
        action.activityType = activityType;
        action.task = entity.task;
        action.project = entity.task.project;
        action.employee = await this._service.getEmployee(activeUser);

        action.details = { tag: entity.projectTag };

        this._service.saveAction(action);
    }
}