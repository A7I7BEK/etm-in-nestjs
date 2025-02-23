import { ForbiddenException } from '@nestjs/common';
import { Action } from 'src/actions/entities/action.entity';
import { BaseSimpleEvent } from 'src/actions/event/base-simple.event';
import { reorderItems } from 'src/common/utils/reorder-items.util';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ProjectType } from 'src/projects/enums/project-type.enum';
import { ProjectColumn } from '../entities/project-column.entity';
import { ProjectColumnPermissions } from '../enums/project-column-permissions.enum';
import { ProjectColumnsService } from '../project-columns.service';


export async function deleteEntity
    (
        service: ProjectColumnsService,
        id: number,
        activeUser: ActiveUserData,
    )
{
    const entity = await service.findOne(
        {
            where: { id },
            relations: {
                project: {
                    columns: true
                },
            },
            order: {
                project: {
                    columns: {
                        ordering: 'ASC',
                    }
                }
            }
        },
        activeUser,
    );


    if (entity.projectType === ProjectType.KANBAN)
    {
        throw new ForbiddenException(`Column of ${ProjectType.KANBAN} project cannot be deleted`);
    }


    const columnList = entity.project.columns.filter(a => a.id !== entity.id);
    reorderItems(columnList);
    await service.repository.save(columnList);
    await service.repository.remove(entity);


    entity.id = id;
    delete entity.project.columns;
    service.columnsGateway.emitDelete(entity, entity.project.id);


    const actionData: BaseSimpleEvent<ProjectColumn> = {
        entity,
        activeUser,
    };
    service.eventEmitter.emit(
        [ Action.name, ProjectColumnPermissions.DELETE ],
        actionData
    );


    return entity;
}
