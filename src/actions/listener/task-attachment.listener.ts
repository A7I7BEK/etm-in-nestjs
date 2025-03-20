import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TaskAttachment } from 'src/task-attachments/entities/task-attachment.entity';
import { TaskAttachmentPermissions } from 'src/task-attachments/enums/task-attachment-permissions.enum';
import { ActionsService } from '../actions.service';
import { Action } from '../entities/action.entity';
import { BaseSimpleEvent } from '../event/base-simple.event';


@Injectable()
export class TaskAttachmentListener
{
    constructor (
        private readonly _service: ActionsService,
    ) { }


    @OnEvent([ Action.name, TaskAttachmentPermissions.CREATE ], { async: true })
    listenCreateEvent(data: BaseSimpleEvent<TaskAttachment>)
    {
        this.handleAllEvents(data, TaskAttachmentPermissions.CREATE);
        // Tom added file "AAA" into task "BBB"
    }


    @OnEvent([ Action.name, TaskAttachmentPermissions.DELETE ], { async: true })
    listenDeleteEvent(data: BaseSimpleEvent<TaskAttachment>)
    {
        this.handleAllEvents(data, TaskAttachmentPermissions.DELETE);
        // Tom removed file "AAA" from task "BBB"
    }


    private async handleAllEvents
        (
            data: BaseSimpleEvent<TaskAttachment>,
            activityType: TaskAttachmentPermissions,
        )
    {
        const { entity, activeUser } = data;

        const action = new Action();
        action.createdAt = new Date();
        action.activityType = activityType;
        action.task = entity.task;
        action.project = entity.task.project;
        action.employee = await this._service.getEmployee(activeUser);

        action.details = { file: entity.file };

        this._service.saveAction(action);
    }
}