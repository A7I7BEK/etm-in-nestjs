import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ProjectMember } from 'src/project-members/entities/project-member.entity';
import { ProjectMemberPermissions } from 'src/project-members/enums/project-member-permissions.enum';
import { ActionsService } from '../actions.service';
import { Action } from '../entities/action.entity';
import { BaseSimpleEvent } from '../event/base-simple.event';
import { ProjectMemberCreateEvent } from '../event/project-member-create.event';


@Injectable()
export class ProjectMemberListener
{
    constructor (
        private readonly _service: ActionsService,
    ) { }


    @OnEvent([ Action.name, ProjectMemberPermissions.Create ], { async: true })
    async listenCreateEvent(data: ProjectMemberCreateEvent)
    {
        const { project, employees, activeUser } = data;

        const action = new Action();
        action.createdAt = new Date();
        action.activityType = ProjectMemberPermissions.Create;
        action.project = project;
        action.employee = await this._service.getEmployee(activeUser);

        action.details = {
            employees,
        };
        // Tom added employees AAA, BBB into the project

        await this._service.repository.save(action);
    }


    @OnEvent([ Action.name, ProjectMemberPermissions.Delete ], { async: true })
    async listenDeleteEvent(data: BaseSimpleEvent<ProjectMember>)
    {
        const { entity, activeUser } = data;

        const action = new Action();
        action.createdAt = new Date();
        action.activityType = ProjectMemberPermissions.Delete;
        action.project = entity.project;
        action.employee = await this._service.getEmployee(activeUser);

        action.details = {
            employee: entity.employee,
        };
        // Tom removed employee "AAA" from the project

        await this._service.repository.save(action);
    }
}