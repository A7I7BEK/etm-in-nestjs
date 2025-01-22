import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ProjectTag } from 'src/project-tags/entities/project-tag.entity';
import { ProjectTagPermissions } from 'src/project-tags/enums/project-tag-permissions.enum';
import { ActionsService } from '../actions.service';
import { Action } from '../entities/action.entity';
import { BaseDiffEvent } from '../event/base-diff.event';
import { BaseSimpleEvent } from '../event/base-simple.event';


@Injectable()
export class ProjectTagListener
{
    constructor (
        private readonly _service: ActionsService,
    ) { }


    @OnEvent([ Action.name, ProjectTagPermissions.Create ], { async: true })
    async listenCreateEvent(data: BaseSimpleEvent<ProjectTag>)
    {
        const { entity, activeUser } = data;

        const action = new Action();
        action.createdAt = new Date();
        action.activityType = ProjectTagPermissions.Create;
        action.project = entity.project;
        action.employee = await this._service.getEmployee(activeUser);

        action.details = {
            id: entity.id,
            name: entity.name,
        };

        await this._service.repository.save(action);
    }


    @OnEvent([ Action.name, ProjectTagPermissions.Update ], { async: true })
    async listenUpdateEvent(data: BaseDiffEvent<ProjectTag>)
    {
        const { oldEntity, newEntity, activeUser } = data;

        const action = new Action();
        action.createdAt = new Date();
        action.activityType = ProjectTagPermissions.Update;
        action.project = oldEntity.project;
        action.employee = await this._service.getEmployee(activeUser);

        const structure = { name: 0, color: 0 };
        action.details = {
            id: oldEntity.id,
            name: oldEntity.name,
            changes: this._service.detectChanges(oldEntity, newEntity, structure)
        };

        await this._service.repository.save(action);
    }


    @OnEvent([ Action.name, ProjectTagPermissions.Delete ], { async: true })
    async listenDeleteEvent(data: BaseSimpleEvent<ProjectTag>)
    {
        const { entity, activeUser } = data;

        const action = new Action();
        action.createdAt = new Date();
        action.activityType = ProjectTagPermissions.Delete;
        action.project = entity.project;
        action.employee = await this._service.getEmployee(activeUser);

        action.details = {
            id: entity.id,
            name: entity.name,
        };

        await this._service.repository.save(action);
    }
}