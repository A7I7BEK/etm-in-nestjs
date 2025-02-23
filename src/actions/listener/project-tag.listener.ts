import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ProjectTag } from 'src/project-tags/entities/project-tag.entity';
import { ProjectTagPermissions } from 'src/project-tags/enums/project-tag-permissions.enum';
import { ActionsService } from '../actions.service';
import { Action } from '../entities/action.entity';
import { BaseDiffEvent } from '../event/base-diff.event';
import { BaseSimpleEvent } from '../event/base-simple.event';
import { detectChanges } from '../utils/detect-changes.util';


@Injectable()
export class ProjectTagListener
{
    constructor (
        private readonly _service: ActionsService,
    ) { }


    @OnEvent([ Action.name, ProjectTagPermissions.CREATE ], { async: true })
    async listenCreateEvent(data: BaseSimpleEvent<ProjectTag>)
    {
        this.handleCreateDelete(data, ProjectTagPermissions.CREATE);
        // Tom created project tag "AAA"
    }


    @OnEvent([ Action.name, ProjectTagPermissions.DELETE ], { async: true })
    async listenDeleteEvent(data: BaseSimpleEvent<ProjectTag>)
    {
        this.handleCreateDelete(data, ProjectTagPermissions.DELETE);
        // Tom deleted project tag "AAA"
    }


    @OnEvent([ Action.name, ProjectTagPermissions.UPDATE ], { async: true })
    async listenUpdateEvent(data: BaseDiffEvent<ProjectTag>)
    {
        const { oldEntity, newEntity, activeUser } = data;

        const action = new Action();
        action.createdAt = new Date();
        action.activityType = ProjectTagPermissions.UPDATE;
        action.project = newEntity.project;
        action.employee = await this._service.getEmployee(activeUser);

        delete newEntity.project;
        const structure = { name: 0, color: 0 };
        action.details = {
            tag: newEntity,
            changes: detectChanges(oldEntity, newEntity, structure)
        };
        // Tom edited project tag "AAA". Changes: ...

        await this._service.repository.save(action);
    }


    private async handleCreateDelete
        (
            data: BaseSimpleEvent<ProjectTag>,
            activityType: ProjectTagPermissions,
        )
    {
        const { entity, activeUser } = data;

        const action = new Action();
        action.createdAt = new Date();
        action.activityType = activityType;
        action.project = entity.project;
        action.employee = await this._service.getEmployee(activeUser);

        delete entity.project;
        action.details = { tag: entity };

        await this._service.repository.save(action);
    }
}