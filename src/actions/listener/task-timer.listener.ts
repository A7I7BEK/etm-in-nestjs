import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TaskTimer } from 'src/task-timer/entities/task-timer.entity';
import { TaskTimerPermissions } from 'src/task-timer/enums/task-timer-permissions.enum';
import { ActionsService } from '../actions.service';
import { Action } from '../entities/action.entity';
import { BaseSimpleEvent } from '../event/base-simple.event';


@Injectable()
export class TaskTimerListener
{
    constructor (
        private readonly _service: ActionsService,
    ) { }


    @OnEvent([ Action.name, TaskTimerPermissions.Start ], { async: true })
    listenStartEvent(data: BaseSimpleEvent<TaskTimer>)
    {
        this.handleAllEvents(data, TaskTimerPermissions.Start);
        // Tom started timer of task "AAA" at "DD-MM-YYYY HH:mm:ss" (time)
    }


    @OnEvent([ Action.name, TaskTimerPermissions.Stop ], { async: true })
    listenStopEvent(data: BaseSimpleEvent<TaskTimer>)
    {
        this.handleAllEvents(data, TaskTimerPermissions.Stop);
        // Tom stopped timer of task "AAA" at "DD-MM-YYYY HH:mm:ss" (time)
    }


    private async handleAllEvents
        (
            data: BaseSimpleEvent<TaskTimer>,
            activityType: TaskTimerPermissions,
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
            timer: entity,
        };
        delete entity.task;

        await this._service.repository.save(action);
    }
}