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


    @OnEvent([ Action.name, TaskAttachmentPermissions.Create ], { async: true })
    listenCreateEvent(data: BaseSimpleEvent<TaskAttachment>)
    {
        this.handleAllEvents(data, TaskAttachmentPermissions.Create);
        // Tom added file into task "AAA"
    }


    @OnEvent([ Action.name, TaskAttachmentPermissions.Delete ], { async: true })
    listenDeleteEvent(data: BaseSimpleEvent<TaskAttachment>)
    {
        this.handleAllEvents(data, TaskAttachmentPermissions.Delete);
        // Tom removed file from task "AAA"
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

        action.details = {
            id: entity.task.id,
            name: entity.task.name,
            file: entity.file,
        };

        await this._service.repository.save(action);
    }
}