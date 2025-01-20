import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TaskUpdateDto } from 'src/tasks/dto/task-update.dto';
import { Task } from 'src/tasks/entities/task.entity';
import { TaskPermissions } from 'src/tasks/enums/task-permissions.enum';
import { ActionsService } from '../actions.service';
import { Action } from '../entities/action.entity';
import { BaseCreateEvent } from '../event/base-create.event';
import { BaseDeleteEvent } from '../event/base-delete.event';
import { BaseUpdateEvent } from '../event/base-update.event';
import { TaskCopyEvent } from '../event/task-copy.event';
import { TaskMoveEvent } from '../event/task-move.event';


@Injectable()
export class TaskListener
{
    constructor (
        private readonly _service: ActionsService,
    ) { }


    @OnEvent([ Action.name, TaskPermissions.Create ], { async: true })
    async listenCreateEvent(data: BaseCreateEvent<Task>)
    {
        const { entity, activeUser } = data;

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

        action.details = {
            id: oldEntity.id,
            name: oldEntity.name,
            changes: this._service.detectChanges(dto, oldEntity),
        };

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


    @OnEvent([ Action.name, TaskPermissions.Copy ], { async: true })
    async listenCopyEvent(data: TaskCopyEvent<Task>)
    {
        const { oldEntity, newEntity, activeUser } = data;

        const action = new Action();
        action.createdAt = new Date();
        action.activityType = TaskPermissions.Copy;
        action.task = newEntity;
        action.project = newEntity.project;
        action.employee = await this._service.getEmployee(activeUser);

        action.details = {
            originalTask: {
                id: oldEntity.id,
                name: oldEntity.name,
            },
            id: newEntity.id,
            name: newEntity.name,
        };

        await this._service.repository.save(action);
    }


    @OnEvent([ Action.name, TaskPermissions.Move ], { async: true })
    async listenMoveEvent(data: TaskMoveEvent<Task>)
    {
        const { oldEntity, newEntity, activeUser } = data;

        const action = new Action();
        action.createdAt = new Date();
        action.activityType = TaskPermissions.Move;
        action.task = newEntity;
        action.project = newEntity.project;
        action.employee = await this._service.getEmployee(activeUser);

        if (oldEntity.project.id !== newEntity.project.id)
        {
            action.details = {
                action: 'migrate',
                id: newEntity.id,
                name: newEntity.name,
                oldProject: {
                    id: oldEntity.project.id,
                    name: oldEntity.project.name,
                },
                newProject: {
                    id: newEntity.project.id,
                    name: newEntity.project.name,
                },
            };
        }
        else if (oldEntity.column.id !== newEntity.column.id)
        {
            action.details = {
                action: 'move',
                id: newEntity.id,
                name: newEntity.name,
                oldColumn: {
                    id: oldEntity.column.id,
                    name: oldEntity.column.name,
                },
                newColumn: {
                    id: newEntity.column.id,
                    name: newEntity.column.name,
                },
            };
        }
        else
        {
            action.details = {
                action: 'reorder',
                id: newEntity.id,
                name: newEntity.name,
            };
        }


        await this._service.repository.save(action);
    }
}