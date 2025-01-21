import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ProjectColumnUpdateDto } from 'src/project-columns/dto/project-column-update.dto';
import { ProjectColumn } from 'src/project-columns/entities/project-column.entity';
import { ProjectColumnPermissions } from 'src/project-columns/enums/project-column-permissions.enum';
import { ActionsService } from '../actions.service';
import { Action } from '../entities/action.entity';
import { BaseCreateEvent } from '../event/base-create.event';
import { BaseDeleteEvent } from '../event/base-delete.event';
import { BaseMoveEvent } from '../event/base-move.event';
import { BaseUpdateEvent } from '../event/base-update.event';


@Injectable()
export class ColumnListener
{
    constructor (
        private readonly _service: ActionsService,
    ) { }


    @OnEvent([ Action.name, ProjectColumnPermissions.Create ], { async: true })
    async listenCreateEvent(data: BaseCreateEvent<ProjectColumn>)
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
    async listenUpdateEvent(data: BaseUpdateEvent<ProjectColumn, ProjectColumnUpdateDto>)
    {
        const { oldEntity, dto, activeUser } = data;

        const action = new Action();
        action.createdAt = new Date();
        action.activityType = ProjectColumnPermissions.Update;
        action.project = oldEntity.project;
        action.employee = await this._service.getEmployee(activeUser);

        action.details = {
            id: oldEntity.id,
            name: oldEntity.name,
            changes: this._service.detectChanges(dto, oldEntity),
        };

        await this._service.repository.save(action);
    }


    @OnEvent([ Action.name, ProjectColumnPermissions.Delete ], { async: true })
    async listenDeleteEvent(data: BaseDeleteEvent<ProjectColumn>)
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
    async listenMoveEvent(data: BaseMoveEvent<ProjectColumn>)
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