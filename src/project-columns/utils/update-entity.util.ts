import { ForbiddenException } from '@nestjs/common';
import { Action } from 'src/actions/entities/action.entity';
import { BaseDiffDtoEvent } from 'src/actions/event/base-diff-dto.event';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ProjectType } from 'src/projects/enums/project-type.enum';
import { ProjectColumnUpdateDto } from '../dto/project-column-update.dto';
import { ProjectColumn } from '../entities/project-column.entity';
import { ProjectColumnPermissions } from '../enums/project-column-permissions.enum';
import { ProjectColumnsService } from '../project-columns.service';
import { wsEmitOneColumn } from './ws-emit-one-column.util';


export async function updateEntity
    (
        service: ProjectColumnsService,
        id: number,
        dto: ProjectColumnUpdateDto,
        activeUser: ActiveUserData,
    )
{
    const entity = await service.findOne(
        {
            where: { id },
            relations: {
                project: true,
            }
        },
        activeUser,
    );


    if (entity.projectType === ProjectType.KANBAN)
    {
        throw new ForbiddenException(`Column of ${ProjectType.KANBAN} project cannot be edited`);
    }


    const oldEntity = structuredClone(entity);


    Object.assign(entity, dto);
    await service.repository.save(entity);


    const actionData: BaseDiffDtoEvent<ProjectColumn, ProjectColumnUpdateDto> = {
        oldEntity,
        dto,
        activeUser,
    };
    service.eventEmitter.emit(
        [ Action.name, ProjectColumnPermissions.Update ],
        actionData
    );


    wsEmitOneColumn(service, entity.id, activeUser, 'replace');


    return entity;
}
