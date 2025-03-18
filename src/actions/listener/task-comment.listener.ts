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


    @OnEvent([ Action.name, TaskCommentPermissions.CREATE ], { async: true })
    listenCreateEvent(data: BaseSimpleEvent<TaskComment>)
    {
        this.handleAllEvents(data, TaskCommentPermissions.CREATE);
        // Tom commented in task "AAA" at "DD-MM-YYYY HH:mm:ss" (updatedAt)
    }


    @OnEvent([ Action.name, TaskCommentPermissions.UPDATE ], { async: true })
    listenUpdateEvent(data: BaseSimpleEvent<TaskComment>)
    {
        this.handleAllEvents(data, TaskCommentPermissions.UPDATE);
        // Tom updated a comment in task "AAA" at "DD-MM-YYYY HH:mm:ss" (updatedAt)
    }


    @OnEvent([ Action.name, TaskCommentPermissions.DELETE ], { async: true })
    listenDeleteEvent(data: BaseSimpleEvent<TaskComment>)
    {
        this.handleAllEvents(data, TaskCommentPermissions.DELETE);
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

        const { employees } = entity;
        delete entity.task;
        delete entity.author;
        delete entity.employees;
        action.details = { comment: entity };

        await this._service.repository.save(action);

        this._service.eventEmitter.emit(
            [ Notification.name, NotificationType.COMMENT ],
            employees,
            action,
        );
    }
}