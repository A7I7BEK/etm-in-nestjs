import { ForbiddenException } from '@nestjs/common';
import { Action } from 'src/actions/entities/action.entity';
import { BaseDiffEvent } from 'src/actions/event/base-diff.event';
import { reorderItems } from 'src/common/utils/reorder-items.util';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ProjectType } from 'src/projects/enums/project-type.enum';
import { ProjectColumnMoveDto } from '../dto/project-column-move.dto';
import { ProjectColumn } from '../entities/project-column.entity';
import { ProjectColumnPermissions } from '../enums/project-column-permissions.enum';
import { ProjectColumnsService } from '../project-columns.service';
import { wsEmitOneColumn } from './ws-emit-one-column.util';


export async function moveEntity
    (
        service: ProjectColumnsService, // BINGO: Parameter service got from outside
        moveDto: ProjectColumnMoveDto,
        activeUser: ActiveUserData,
    )
{
    const entity = await service.findOne(
        {
            where: { id: moveDto.id },
            relations: {
                project: {
                    columns: true
                }
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
        throw new ForbiddenException(`Column of ${ProjectType.KANBAN} project cannot be moved`);
    }


    const oldEntity = structuredClone(entity);
    delete oldEntity.project.columns;


    const columnList = [ ...entity.project.columns ];
    const column = columnList.find(a => a.id === entity.id);
    columnList.splice(columnList.indexOf(column), 1);
    columnList.splice(moveDto.ordering, 0, column);
    reorderItems(columnList);
    await service.repository.save(columnList);


    entity.ordering = column.ordering;
    delete entity.project.columns;
    service.columnsGateway.emitReorder(entity, entity.project.id);


    const actionData: BaseDiffEvent<ProjectColumn> = {
        oldEntity,
        newEntity: structuredClone(entity),
        activeUser,
    };
    service.eventEmitter.emit(
        [ Action.name, ProjectColumnPermissions.MOVE ],
        actionData
    );


    return entity;


    /**
     * There are a lot of complications when moving column
     * into a new project. Specifically:
     * - all tasks inside the column must be moved too
     * - all the details in a task that are connected
     * to the current project must be updated
     * - most probably every project has different settings,
     * so it will be hard to update all task details
     */
    if (entity.project.id === moveDto.projectId)
    {
        // same project
        const columnList = [ ...entity.project.columns ];
        const column = columnList.find(a => a.id === entity.id);
        columnList.splice(columnList.indexOf(column), 1);
        columnList.splice(moveDto.ordering, 0, column);
        reorderItems(columnList);
        await service.repository.save(columnList);


        entity.ordering = column.ordering;
        delete entity.project.columns;
        service.columnsGateway.emitReorder(entity, entity.project.id);


        return entity;
    }


    const projectEntity = await service.projectsService.findOne(
        {
            where: { id: moveDto.projectId },
            relations: { columns: true },
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
        throw new ForbiddenException(`Column cannot be moved into ${ProjectType.KANBAN} project`);
    }


    // old project
    const oldColumnList = entity.project.columns.filter(a => a.id !== entity.id);
    reorderItems(oldColumnList);
    await service.repository.save(oldColumnList);


    // new project
    const entityOld = structuredClone(entity);
    delete entityOld.project.columns;

    entity.project = { ...projectEntity };
    delete entity.project.columns;
    projectEntity.columns.splice(moveDto.ordering, 0, entity);
    reorderItems(projectEntity.columns);
    await service.repository.save(projectEntity.columns);


    service.columnsGateway.emitDelete(entityOld, entityOld.project.id); // delete from old project
    wsEmitOneColumn(service, entity.id, activeUser, 'send'); // insert to new project


    return entity;
}
