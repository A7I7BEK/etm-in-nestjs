import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TaskCreateDto } from 'src/tasks/dto/task-create.dto';
import { TaskUpdateDto } from 'src/tasks/dto/task-update.dto';
import { Task } from 'src/tasks/entities/task.entity';
import { TaskPermissions } from 'src/tasks/enums/task-permissions.enum';
import { ActionsService } from '../actions.service';
import { Action } from '../entities/action.entity';
import { BaseCreateEvent } from '../event/base-create.event';
import { BaseUpdateEvent } from '../event/base-update.event';


@Injectable()
export class TaskListener
{
    constructor (
        private readonly _service: ActionsService,
    ) { }


    @OnEvent([ Action.name, TaskPermissions.Create ], { async: true })
    async listenCreateEvent(data: BaseCreateEvent<Task, TaskCreateDto>)
    {
        const { entity, dto, activeUser } = data;

        const action = new Action();
        action.createdAt = new Date();
        action.activityType = TaskPermissions.Create;
        action.employee = await this._service.getEmployee(activeUser);
        action.task = entity;
        action.project = entity.project;

        action.details = {
            name: entity.name,
            column: { id: entity.column.id, name: entity.column.name },
            project: { id: entity.project.id, name: entity.project.name },
        };

        await this._service.repository.save(action);
    }


    @OnEvent([ Action.name, TaskPermissions.Update ], { async: true })
    async listenUpdateEvent(data: BaseUpdateEvent<Task, TaskUpdateDto>)
    {
        const { oldEntity, dto, activeUser } = data;

        const action = new Action();
        action.createdAt = new Date();
        action.activityType = TaskPermissions.Update;
        action.details = this._service.detectChanges(dto, oldEntity);
        action.employee = await this._service.getEmployee(activeUser);
        action.task = oldEntity;
        action.project = oldEntity.project;

        await this._service.repository.save(action);
    }
}