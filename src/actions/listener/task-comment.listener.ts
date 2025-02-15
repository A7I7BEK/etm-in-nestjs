import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Notification } from 'src/notifications/entities/notification.entity';
import { NotificationType } from 'src/notifications/enums/notification-type.enum';
import { TaskComment } from 'src/task-comments/entities/task-comment.entity';
import { TaskCommentPermissions } from 'src/task-comments/enums/task-comment-permissions.enum';
import { ActionsService } from '../actions.service';
import { Action } from '../entities/action.entity';
import { BaseSimpleEvent } from '../event/base-simple.event';


@Injectable()
export class TaskCommentListener
{
    constructor (
        private readonly _service: ActionsService,
    ) { }


    @OnEvent([ Action.name, TaskCommentPermissions.Create ], { async: true })
    listenCreateEvent(data: BaseSimpleEvent<TaskComment>)
    {
        this.handleAllEvents(data, TaskCommentPermissions.Create);
        // Tom commented in task "AAA" at "DD-MM-YYYY HH:mm:ss" (updatedAt)
    }


    @OnEvent([ Action.name, TaskCommentPermissions.Update ], { async: true })
    listenUpdateEvent(data: BaseSimpleEvent<TaskComment>)
    {
        this.handleAllEvents(data, TaskCommentPermissions.Update);
        // Tom updated a comment in task "AAA" at "DD-MM-YYYY HH:mm:ss" (updatedAt)
    }


    @OnEvent([ Action.name, TaskCommentPermissions.Delete ], { async: true })
    listenDeleteEvent(data: BaseSimpleEvent<TaskComment>)
    {
        this.handleAllEvents(data, TaskCommentPermissions.Delete);
        // Tom deleted a comment in task "AAA" at "DD-MM-YYYY HH:mm:ss" (updatedAt)
    }


    private async handleAllEvents
        (
            data: BaseSimpleEvent<TaskComment>,
            activityType: TaskCommentPermissions,
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
        action.details = { comment: entity };

        await this._service.repository.save(action);

        this._service.eventEmitter.emit(
            [ Notification.name, NotificationType.Comment ],
            action
        );
    }
}