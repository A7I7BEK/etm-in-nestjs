import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TaskTag } from 'src/task-tags/entities/task-tag.entity';
import { TaskTagPermissions } from 'src/task-tags/enums/task-tag-permissions.enum';
import { ActionsService } from '../actions.service';
import { Action } from '../entities/action.entity';
import { BaseSimpleEvent } from '../event/base-simple.event';


@Injectable()
export class TaskTagListener
{
    constructor (
        private readonly _service: ActionsService,
    ) { }


    @OnEvent([ Action.name, TaskTagPermissions.Create ], { async: true })
    async listenCreateEvent(data: BaseSimpleEvent<TaskTag>)
    {
        const { entity, activeUser } = data;

        const action = new Action();
        action.createdAt = new Date();
        action.activityType = TaskTagPermissions.Create;
        action.task = entity.task;
        action.project = entity.task.project;
        action.employee = await this._service.getEmployee(activeUser);

        action.details = {
            id: entity.task.id,
            name: entity.task.name,
            tag: entity.projectTag,
        };
        // Tom added tag "AAA" into task "BBB"

        await this._service.repository.save(action);
    }


    @OnEvent([ Action.name, TaskTagPermissions.Delete ], { async: true })
    async listenDeleteEvent(data: BaseSimpleEvent<TaskTag>)
    {
        const { entity, activeUser } = data;

        const action = new Action();
        action.createdAt = new Date();
        action.activityType = TaskTagPermissions.Delete;
        action.task = entity.task;
        action.project = entity.task.project;
        action.employee = await this._service.getEmployee(activeUser);

        action.details = {
            id: entity.task.id,
            name: entity.task.name,
            tag: entity.projectTag,
        };
        // Tom removed tag "AAA" from task "BBB"

        await this._service.repository.save(action);
    }
}