import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ProjectColumn } from 'src/project-columns/entities/project-column.entity';
import { ProjectColumnPermissions } from 'src/project-columns/enums/project-column-permissions.enum';
import { ActionsService } from '../actions.service';
import { Action } from '../entities/action.entity';
import { BaseDiffEvent } from '../event/base-diff.event';
import { BaseSimpleEvent } from '../event/base-simple.event';


@Injectable()
export class ColumnListener
{
    constructor (
        private readonly _service: ActionsService,
    ) { }


    @OnEvent([ Action.name, ProjectColumnPermissions.Create ], { async: true })
    async listenCreateEvent(data: BaseSimpleEvent<ProjectColumn>)
    {
        const { entity, activeUser } = data;

        const action = new Action();
        action.createdAt = new Date();
        action.activityType = ProjectColumnPermissions.Create;
        action.project = entity.project;
        action.employee = await this._service.getEmployee(activeUser);

        action.details = {
            id: entity.id,
            name: entity.name,
        };

        await this._service.repository.save(action);
    }


    @OnEvent([ Action.name, ProjectColumnPermissions.Update ], { async: true })
    async listenUpdateEvent(data: BaseDiffEvent<ProjectColumn>)
    {
        const { oldEntity, newEntity, activeUser } = data;

        const action = new Action();
        action.createdAt = new Date();
        action.activityType = ProjectColumnPermissions.Update;
        action.project = oldEntity.project;
        action.employee = await this._service.getEmployee(activeUser);

        const structure = { name: 0, codeName: 0 };
        action.details = {
            id: oldEntity.id,
            name: oldEntity.name,
            changes: this._service.detectChanges(oldEntity, newEntity, structure)
        };

        await this._service.repository.save(action);
    }


    @OnEvent([ Action.name, ProjectColumnPermissions.Delete ], { async: true })
    async listenDeleteEvent(data: BaseSimpleEvent<ProjectColumn>)
    {
        const { entity, activeUser } = data;

        const action = new Action();
        action.createdAt = new Date();
        action.activityType = ProjectColumnPermissions.Delete;
        action.project = entity.project;
        action.employee = await this._service.getEmployee(activeUser);

        action.details = {
            id: entity.id,
            name: entity.name,
        };

        await this._service.repository.save(action);
    }


    @OnEvent([ Action.name, ProjectColumnPermissions.Move ], { async: true })
    async listenMoveEvent(data: BaseDiffEvent<ProjectColumn>)
    {
        const { oldEntity, newEntity, activeUser } = data;

        const action = new Action();
        action.createdAt = new Date();
        action.activityType = ProjectColumnPermissions.Move;
        action.project = newEntity.project;
        action.employee = await this._service.getEmployee(activeUser);

        action.details = {
            action: 'reorder',
            id: newEntity.id,
            name: newEntity.name,
        };

        await this._service.repository.save(action);
    }
}