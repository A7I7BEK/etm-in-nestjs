import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Project } from 'src/projects/entities/project.entity';
import { ProjectPermissions } from 'src/projects/enums/project-permissions.enum';
import { ActionsService } from '../actions.service';
import { Action } from '../entities/action.entity';
import { BaseDiffEvent } from '../event/base-diff.event';
import { BaseSimpleEvent } from '../event/base-simple.event';


@Injectable()
export class ProjectListener
{
    constructor (
        private readonly _service: ActionsService,
    ) { }


    @OnEvent([ Action.name, ProjectPermissions.Create ], { async: true })
    async listenCreateEvent(data: BaseSimpleEvent<Project>)
    {
        const { entity, activeUser } = data;

        const action = new Action();
        action.createdAt = new Date();
        action.activityType = ProjectPermissions.Create;
        action.project = entity;
        action.employee = await this._service.getEmployee(activeUser);

        action.details = {
            id: entity.id,
            name: entity.name,
        };

        await this._service.repository.save(action);
    }


    @OnEvent([ Action.name, ProjectPermissions.Update ], { async: true })
    async listenUpdateEvent(data: BaseDiffEvent<Project>)
    {
        const { oldEntity, newEntity, activeUser } = data;

        const action = new Action();
        action.createdAt = new Date();
        action.activityType = ProjectPermissions.Update;
        action.project = oldEntity;
        action.employee = await this._service.getEmployee(activeUser);

        const structure = {
            name: 0,
            codeName: 0,
            group: { id: 0, name: 0 },
            manager: { id: 0, firstName: 0, lastName: 0 },
        };
        action.details = {
            id: oldEntity.id,
            name: oldEntity.name,
            changes: this._service.detectChanges(oldEntity, newEntity, structure)
        };

        await this._service.repository.save(action);
    }
}