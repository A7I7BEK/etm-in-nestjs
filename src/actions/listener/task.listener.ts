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


    @OnEvent([ Action.name, TaskPermissions.CREATE ], { async: true })
    async listenCreateEvent(data: BaseSimpleEvent<Task>)
    {
        const { entity, activeUser } = data;

        const action = new Action();
        action.createdAt = new Date();
        action.activityType = TaskPermissions.CREATE;
        action.task = entity;
        action.project = entity.project;
        action.employee = await this._service.getEmployee(activeUser);

        action.details = {};
        // Tom created task "AAA"

        this._service.saveAction(action);
    }


    @OnEvent([ Action.name, TaskPermissions.UPDATE ], { async: true })
    async listenUpdateEvent(data: BaseDiffEvent<Task>)
    {
        const { oldEntity, newEntity, activeUser } = data;

        const action = new Action();
        action.createdAt = new Date();
        action.activityType = TaskPermissions.UPDATE;
        action.task = newEntity;
        action.project = newEntity.project;
        action.employee = await this._service.getEmployee(activeUser);

        const structure = { name: 0, description: 0, level: 0, priority: 0 };
        action.details = {
            changes: detectChanges(oldEntity, newEntity, structure)
        };
        // Tom edited task "AAA". Changes: ...

        this._service.saveAction(action);
    }


    @OnEvent([ Action.name, TaskPermissions.DELETE ], { async: true })
    async listenDeleteEvent(data: BaseSimpleEvent<Task>)
    {
        const { entity, activeUser } = data;

        const action = new Action();
        action.createdAt = new Date();
        action.activityType = TaskPermissions.DELETE;
        action.project = entity.project;
        action.employee = await this._service.getEmployee(activeUser);

        action.details = { task: entity };
        // Tom deleted task "AAA"

        this._service.saveAction(action);
    }


    @OnEvent([ Action.name, TaskPermissions.COPY ], { async: true })
    async listenCopyEvent(data: BaseDiffEvent<Task>)
    {
        const { oldEntity, newEntity, activeUser } = data;

        const action = new Action();
        action.createdAt = new Date();
        action.activityType = TaskPermissions.COPY;
        action.task = newEntity;
        action.project = newEntity.project;
        action.employee = await this._service.getEmployee(activeUser);

        action.details = { originalTask: oldEntity };
        // Tom created copy of the task "BBB" from "original-AAA"

        this._service.saveAction(action);
    }


    @OnEvent([ Action.name, TaskPermissions.MOVE ], { async: true })
    async listenMoveEvent(data: BaseDiffEvent<Task>)
    {
        const { oldEntity, newEntity, activeUser } = data;

        const action = new Action();
        action.createdAt = new Date();
        action.activityType = TaskPermissions.MOVE;
        action.task = newEntity;
        action.project = newEntity.project;
        action.employee = await this._service.getEmployee(activeUser);

        if (oldEntity.project.id !== newEntity.project.id)
        {
            action.details = {
                action: 'migrate',
                oldProject: oldEntity.project,
                newProject: newEntity.project,
            };
            // Tom migrated task "AAA" from project "old-XXX"
        }
        else if (oldEntity.column.id !== newEntity.column.id)
        {
            action.details = {
                action: 'move',
                oldColumn: oldEntity.column,
                newColumn: newEntity.column,
            };
            // Tom moved task "AAA" from column "XXX" into "YYY"
        }
        else
        {
            action.details = { action: 'reorder' };
            // Tom reordered task "AAA"
        }

        this._service.saveAction(action);
    }
}