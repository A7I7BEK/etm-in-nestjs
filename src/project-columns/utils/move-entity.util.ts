import { ForbiddenException } from '@nestjs/common';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ProjectType } from 'src/projects/enums/project-type.enum';
import { ProjectColumnMoveDto } from '../dto/project-column-move.dto';
import { ProjectColumn } from '../entities/project-column.entity';
import { ProjectColumnsService } from '../project-columns.service';


export async function moveEntity
    (
        service: ProjectColumnsService, // BINGO
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
            }
        },
        activeUser,
    );


    if (entity.projectType === ProjectType.KANBAN)
    {
        throw new ForbiddenException(`Column of ${ProjectType.KANBAN} project cannot be moved`);
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


    const column = projectEntity.columns.find((col) => col.id === entity.id);
    if (column)
    {
        // existing project
        projectEntity.columns.splice(projectEntity.columns.indexOf(column), 1);
        projectEntity.columns.splice(moveDto.ordering, 0, column);
    }
    else
    {
        // old project
        const oldProject = entity.project;
        oldProject.columns.splice(oldProject.columns.findIndex(a => a.id === entity.id), 1);
        reOrderColumns(oldProject.columns);
        await service.repository.save(oldProject.columns);


        // new project
        entity.project = { ...projectEntity };
        delete entity.project.columns;
        projectEntity.columns.splice(moveDto.ordering, 0, entity);
    }


    reOrderColumns(projectEntity.columns);
    await service.repository.save(projectEntity.columns);


    return column ? column : entity;
}


function reOrderColumns(columns: ProjectColumn[])
{
    columns.forEach((item, index) =>
    {
        item.ordering = index;
    });
}
