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


    @OnEvent([ Action.name, TaskTimerPermissions.START ], { async: true })
    listenStartEvent(data: BaseSimpleEvent<TaskTimer>)
    {
        this.handleAllEvents(data, TaskTimerPermissions.START);
        // Tom started timer of task "AAA" at "DD-MM-YYYY HH:mm:ss" (time)
    }


    @OnEvent([ Action.name, TaskTimerPermissions.STOP ], { async: true })
    listenStopEvent(data: BaseSimpleEvent<TaskTimer>)
    {
        this.handleAllEvents(data, TaskTimerPermissions.STOP);
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

        delete entity.task;
        delete entity.employee;
        action.details = { timer: entity };

        this._service.saveAction(action);
    }
}