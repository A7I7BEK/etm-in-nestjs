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


    @OnEvent([ Action.name, TaskDeadlinePermissions.Create ], { async: true })
    listenCreateEvent(data: BaseDiffEvent<Task>)
    {
        this.handleAllEvents(data, TaskDeadlinePermissions.Create);
        // Tom set time for the task "AAA". Changes ...
    }


    @OnEvent([ Action.name, TaskDeadlinePermissions.Update ], { async: true })
    listenUpdateEvent(data: BaseDiffEvent<Task>)
    {
        this.handleAllEvents(data, TaskDeadlinePermissions.Update);
        // Tom updated time of the task "AAA". Changes ...
    }


    @OnEvent([ Action.name, TaskDeadlinePermissions.Delete ], { async: true })
    listenDeleteEvent(data: BaseDiffEvent<Task>)
    {
        this.handleAllEvents(data, TaskDeadlinePermissions.Delete);
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
        action.task = oldEntity;
        action.project = oldEntity.project;
        action.employee = await this._service.getEmployee(activeUser);

        const structure = { startDate: 0, endDate: 0 };
        action.details = {
            id: oldEntity.id,
            name: oldEntity.name,
            changes: detectChanges(oldEntity, newEntity, structure)
        };

        await this._service.repository.save(action);
    }
}