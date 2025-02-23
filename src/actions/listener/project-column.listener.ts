import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ProjectColumn } from 'src/project-columns/entities/project-column.entity';
import { ProjectColumnPermissions } from 'src/project-columns/enums/project-column-permissions.enum';
import { ActionsService } from '../actions.service';
import { Action } from '../entities/action.entity';
import { BaseDiffEvent } from '../event/base-diff.event';
import { BaseSimpleEvent } from '../event/base-simple.event';
import { detectChanges } from '../utils/detect-changes.util';


@Injectable()
export class ProjectColumnListener
{
    constructor (
        private readonly _service: ActionsService,
    ) { }


    @OnEvent([ Action.name, ProjectColumnPermissions.CREATE ], { async: true })
    async listenCreateEvent(data: BaseSimpleEvent<ProjectColumn>)
    {
        const { entity, activeUser } = data;

        const action = new Action();
        action.createdAt = new Date();
        action.activityType = ProjectColumnPermissions.CREATE;
        action.project = entity.project;
        action.employee = await this._service.getEmployee(activeUser);

        delete entity.project;
        action.details = { column: entity };
        // Tom created column "AAA"

        await this._service.repository.save(action);
    }


    @OnEvent([ Action.name, ProjectColumnPermissions.UPDATE ], { async: true })
    async listenUpdateEvent(data: BaseDiffEvent<ProjectColumn>)
    {
        const { oldEntity, newEntity, activeUser } = data;

        const action = new Action();
        action.createdAt = new Date();
        action.activityType = ProjectColumnPermissions.UPDATE;
        action.project = newEntity.project;
        action.employee = await this._service.getEmployee(activeUser);

        delete newEntity.project;
        const structure = { name: 0 };
        action.details = {
            column: newEntity,
            changes: detectChanges(oldEntity, newEntity, structure)
        };
        // Tom edited column "AAA". Changes: ...

        await this._service.repository.save(action);
    }


    @OnEvent([ Action.name, ProjectColumnPermissions.DELETE ], { async: true })
    async listenDeleteEvent(data: BaseSimpleEvent<ProjectColumn>)
    {
        const { entity, activeUser } = data;

        const action = new Action();
        action.createdAt = new Date();
        action.activityType = ProjectColumnPermissions.DELETE;
        action.project = entity.project;
        action.employee = await this._service.getEmployee(activeUser);

        delete entity.project;
        action.details = { column: entity };
        // Tom deleted column "AAA"

        await this._service.repository.save(action);
    }


    @OnEvent([ Action.name, ProjectColumnPermissions.MOVE ], { async: true })
    async listenMoveEvent(data: BaseDiffEvent<ProjectColumn>)
    {
        const { oldEntity, newEntity, activeUser } = data;

        const action = new Action();
        action.createdAt = new Date();
        action.activityType = ProjectColumnPermissions.MOVE;
        action.project = newEntity.project;
        action.employee = await this._service.getEmployee(activeUser);

        delete newEntity.project;
        action.details = {
            action: 'reorder',
            column: newEntity,
        };
        // Tom reordered column "AAA"

        await this._service.repository.save(action);
    }
}