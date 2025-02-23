import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Notification } from 'src/notifications/entities/notification.entity';
import { NotificationType } from 'src/notifications/enums/notification-type.enum';
import { TaskMember } from 'src/task-members/entities/task-member.entity';
import { TaskMemberPermissions } from 'src/task-members/enums/task-member-permissions.enum';
import { ActionsService } from '../actions.service';
import { Action } from '../entities/action.entity';
import { BaseSimpleEvent } from '../event/base-simple.event';


@Injectable()
export class TaskMemberListener
{
    constructor (
        private readonly _service: ActionsService,
    ) { }


    @OnEvent([ Action.name, TaskMemberPermissions.CREATE ], { async: true })
    listenCreateEvent(data: BaseSimpleEvent<TaskMember>)
    {
        this.handleAllEvents(data, TaskMemberPermissions.CREATE);
        // Tom added member "AAA" into task "BBB"
    }


    @OnEvent([ Action.name, TaskMemberPermissions.DELETE ], { async: true })
    listenDeleteEvent(data: BaseSimpleEvent<TaskMember>)
    {
        this.handleAllEvents(data, TaskMemberPermissions.DELETE);
        // Tom removed member "AAA" from task "BBB"
    }


    private async handleAllEvents
        (
            data: BaseSimpleEvent<TaskMember>,
            activityType: TaskMemberPermissions,
        )
    {
        const { entity, activeUser } = data;

        const action = new Action();
        action.createdAt = new Date();
        action.activityType = activityType;
        action.task = entity.task;
        action.project = entity.projectMember.project;
        action.employee = await this._service.getEmployee(activeUser);

        action.details = { member: entity.projectMember.employee };

        await this._service.repository.save(action);

        this._service.eventEmitter.emit(
            [ Notification.name, NotificationType.TASK ],
            action
        );
    }
}