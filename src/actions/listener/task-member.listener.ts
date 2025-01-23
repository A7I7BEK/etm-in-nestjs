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
    async listenCreateEvent(data: BaseSimpleEvent<TaskMember>)
    {
        const { entity, activeUser } = data;

        const action = new Action();
        action.createdAt = new Date();
        action.activityType = TaskMemberPermissions.Create;
        action.task = entity.task;
        action.project = entity.projectMember.project;
        action.employee = await this._service.getEmployee(activeUser);

        action.details = {
            id: entity.task.id,
            name: entity.task.name,
            member: entity.projectMember.employee,
        };
        // Tom added member "AAA" into task "BBB"

        await this._service.repository.save(action);
    }


    @OnEvent([ Action.name, TaskMemberPermissions.Delete ], { async: true })
    async listenDeleteEvent(data: BaseSimpleEvent<TaskMember>)
    {
        const { entity, activeUser } = data;

        const action = new Action();
        action.createdAt = new Date();
        action.activityType = TaskMemberPermissions.Delete;
        action.task = entity.task;
        action.project = entity.projectMember.project;
        action.employee = await this._service.getEmployee(activeUser);

        action.details = {
            id: entity.task.id,
            name: entity.task.name,
            member: entity.projectMember.employee,
        };
        // Tom removed member "AAA" from task "BBB"

        await this._service.repository.save(action);
    }
}