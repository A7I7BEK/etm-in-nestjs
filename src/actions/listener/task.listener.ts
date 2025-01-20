import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TaskCreateDto } from 'src/tasks/dto/task-create.dto';
import { TaskUpdateDto } from 'src/tasks/dto/task-update.dto';
import { Task } from 'src/tasks/entities/task.entity';
import { TaskPermissions } from 'src/tasks/enums/task-permissions.enum';
import { ActionsService } from '../actions.service';
import { Action } from '../entities/action.entity';
import { BaseCreateEvent } from '../event/base-create.event';
import { BaseDeleteEvent } from '../event/base-delete.event';
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
        action.task = entity;
        action.project = entity.project;
        action.employee = await this._service.getEmployee(activeUser);

        action.details = {
            id: entity.id,
            name: entity.name,
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
        action.task = oldEntity;
        action.project = oldEntity.project;
        action.employee = await this._service.getEmployee(activeUser);
        action.details = this._service.detectChanges(dto, oldEntity);

        await this._service.repository.save(action);
    }


    @OnEvent([ Action.name, TaskPermissions.Delete ], { async: true })
    async listenDeleteEvent(data: BaseDeleteEvent<Task>)
    {
        const { entity, activeUser } = data;

        const action = new Action();
        action.createdAt = new Date();
        action.activityType = TaskPermissions.Delete;
        action.task = entity;
        action.project = entity.project;
        action.employee = await this._service.getEmployee(activeUser);

        action.details = {
            id: entity.id,
            name: entity.name,
        };

        await this._service.repository.save(action);
    }
}