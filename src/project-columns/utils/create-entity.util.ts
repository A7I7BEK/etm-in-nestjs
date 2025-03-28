import { ForbiddenException } from '@nestjs/common';
import { Action } from 'src/actions/entities/action.entity';
import { BaseSimpleEvent } from 'src/actions/event/base-simple.event';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ProjectType } from 'src/projects/enums/project-type.enum';
import { ProjectColumnCreateDto } from '../dto/project-column-create.dto';
import { ProjectColumn } from '../entities/project-column.entity';
import { ProjectColumnPermissions } from '../enums/project-column-permissions.enum';
import { ProjectColumnsService } from '../project-columns.service';
import { wsEmitOneColumn } from './ws-emit-one-column.util';


export async function createEntity
    (
        service: ProjectColumnsService,
        dto: ProjectColumnCreateDto,
        activeUser: ActiveUserData,
    )
{
    const projectEntity = await service.projectsService.findOne(
        {
            where: {
                id: dto.projectId
            },
            relations: {
                columns: true,
            },
            order: {
                columns: {
                    ordering: 'ASC',
                }
            }
        },
        activeUser,
    );


    if (projectEntity.projectType === ProjectType.KANBAN)
    {
        throw new ForbiddenException(`Column cannot be created in a ${ProjectType.KANBAN} project`);
    }


    const entity = new ProjectColumn();
    entity.name = dto.name;
    entity.ordering = projectEntity.columns.length;
    entity.project = { ...projectEntity };
    delete entity.project.columns;
    await service.repository.save(entity);


    const actionData: BaseSimpleEvent<ProjectColumn> = {
        entity: structuredClone(entity),
        activeUser,
    };
    service.eventEmitter.emit(
        [ Action.name, ProjectColumnPermissions.CREATE ],
        actionData
    );


    wsEmitOneColumn(service, entity.id, activeUser, 'insert');


    return entity;
}
