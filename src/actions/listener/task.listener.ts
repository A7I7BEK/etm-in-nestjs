import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Task } from 'src/tasks/entities/task.entity';
import { TaskPermissions } from 'src/tasks/enums/task-permissions.enum';
import { ActionsService } from '../actions.service';
import { Action } from '../entities/action.entity';
import { BaseDiffEvent } from '../event/base-diff.event';
import { BaseSimpleEvent } from '../event/base-simple.event';
import { detectChanges } from '../utils/detect-changes.util';


@Injectable()
export class TaskListener
{
    constructor (
        private readonly _service: ActionsService,
    ) { }


    @OnEvent([ Action.name, TaskPermissions.Create ], { async: true })
    async listenCreateEvent(data: BaseSimpleEvent<Task>)
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
        // Tom created task "AAA"

        await this._service.repository.save(action);
    }


    @OnEvent([ Action.name, TaskPermissions.Update ], { async: true })
    async listenUpdateEvent(data: BaseDiffEvent<Task>)
    {
        const { oldEntity, newEntity, activeUser } = data;

        const action = new Action();
        action.createdAt = new Date();
        action.activityType = TaskPermissions.Update;
        action.task = oldEntity;
        action.project = oldEntity.project;
        action.employee = await this._service.getEmployee(activeUser);

        const structure = { name: 0, description: 0, level: 0, priority: 0 };
        action.details = {
            id: oldEntity.id,
            name: oldEntity.name,
            changes: detectChanges(oldEntity, newEntity, structure)
        };
        // Tom edited task "AAA". Changes: ...

        await this._service.repository.save(action);
    }


    @OnEvent([ Action.name, TaskPermissions.Delete ], { async: true })
    async listenDeleteEvent(data: BaseSimpleEvent<Task>)
    {
        const { entity, activeUser } = data;

        const action = new Action();
        action.createdAt = new Date();
        action.activityType = TaskPermissions.Delete;
        action.task = entity; // TODO: check if relations are working
        action.project = entity.project;
        action.employee = await this._service.getEmployee(activeUser);

        action.details = {
            id: entity.id,
            name: entity.name,
        };
        // Tom deleted task "AAA"

        await this._service.repository.save(action);
    }


    @OnEvent([ Action.name, TaskPermissions.Copy ], { async: true })
    async listenCopyEvent(data: BaseDiffEvent<Task>)
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
        // Tom created copy of the task "BBB" from "AAA"

        await this._service.repository.save(action);
    }


    @OnEvent([ Action.name, TaskPermissions.Move ], { async: true })
    async listenMoveEvent(data: BaseDiffEvent<Task>)
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
            // Tom migrated task "AAA" from project "OLD-XXX"
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
            // Tom moved task "AAA" from column "XXX" into "YYY"
        }
        else
        {
            action.details = {
                action: 'reorder',
                id: newEntity.id,
                name: newEntity.name,
            };
            // Tom reordered task "AAA"
        }


        await this._service.repository.save(action);
    }
}