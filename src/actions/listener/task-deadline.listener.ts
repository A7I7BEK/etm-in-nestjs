import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TaskDeadlinePermissions } from 'src/task-deadline/enums/task-deadline-permissions.enum';
import { Task } from 'src/tasks/entities/task.entity';
import { ActionsService } from '../actions.service';
import { Action } from '../entities/action.entity';
import { BaseDiffEvent } from '../event/base-diff.event';
import { detectChanges } from '../utils/detect-changes.util';


@Injectable()
export class TaskDeadlineListener
{
    constructor (
        private readonly _service: ActionsService,
    ) { }


    @OnEvent([ Action.name, TaskDeadlinePermissions.CREATE ], { async: true })
    listenCreateEvent(data: BaseDiffEvent<Task>)
    {
        this.handleAllEvents(data, TaskDeadlinePermissions.CREATE);
        // Tom set time for the task "AAA". Changes ...
    }


    @OnEvent([ Action.name, TaskDeadlinePermissions.UPDATE ], { async: true })
    listenUpdateEvent(data: BaseDiffEvent<Task>)
    {
        this.handleAllEvents(data, TaskDeadlinePermissions.UPDATE);
        // Tom updated time of the task "AAA". Changes ...
    }


    @OnEvent([ Action.name, TaskDeadlinePermissions.DELETE ], { async: true })
    listenDeleteEvent(data: BaseDiffEvent<Task>)
    {
        this.handleAllEvents(data, TaskDeadlinePermissions.DELETE);
        // Tom deleted time of the task "AAA". Changes ...
    }


    private async handleAllEvents
        (
            data: BaseDiffEvent<Task>,
            activityType: TaskDeadlinePermissions,
        )
    {
        const { oldEntity, newEntity, activeUser } = data;

        const action = new Action();
        action.createdAt = new Date();
        action.activityType = activityType;
        action.task = newEntity;
        action.project = newEntity.project;
        action.employee = await this._service.getEmployee(activeUser);

        const structure = { startDate: 0, endDate: 0 };
        action.details = {
            changes: detectChanges(oldEntity, newEntity, structure)
        };

        this._service.saveAction(action);
    }
}