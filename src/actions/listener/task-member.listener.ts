import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
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


    @OnEvent([ Action.name, TaskMemberPermissions.Create ], { async: true })
    listenCreateEvent(data: BaseSimpleEvent<TaskMember>)
    {
        this.handleAllEvents(data, TaskMemberPermissions.Create);
        // Tom added member "AAA" into task "BBB"
    }


    @OnEvent([ Action.name, TaskMemberPermissions.Delete ], { async: true })
    listenDeleteEvent(data: BaseSimpleEvent<TaskMember>)
    {
        this.handleAllEvents(data, TaskMemberPermissions.Delete);
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
    }
}