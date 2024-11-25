import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { setNestedOptions } from 'src/common/utils/set-nested-options.util';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ProjectType } from 'src/projects/enums/project-type';
import { ProjectsService } from 'src/projects/projects.service';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { ProjectColumnCreateDto } from './dto/project-column-create.dto';
import { ProjectColumnMoveDto } from './dto/project-column-move.dto';
import { ProjectColumnUpdateDto } from './dto/project-column-update.dto';
import { ProjectColumn } from './entities/project-column.entity';
import { createUpdateEntity } from './utils/create-update-entity.util';

@Injectable()
export class ProjectColumnsService
{
    constructor (
        @InjectRepository(ProjectColumn)
        public readonly repository: Repository<ProjectColumn>,
        private readonly _projectsService: ProjectsService,
    ) { }


    create
        (
            createDto: ProjectColumnCreateDto,
            activeUser: ActiveUserData,
        )
    {
        return createUpdateEntity(
            this._projectsService,
            this.repository,
            createDto,
            activeUser,
        );
    }


    findAll
        (
            options: FindManyOptions<ProjectColumn>,
            activeUser: ActiveUserData,
        )
    {
        if (!activeUser.systemAdmin)
        {
            const orgOption: FindManyOptions<ProjectColumn> = {
                where: {
                    project: {
                        organization: {
                            id: activeUser.orgId
                        }
                    }
                }
            };

            setNestedOptions(options ??= {}, orgOption);
        }

        return this.repository.find(options);
    }


    async findOne
        (
            options: FindOneOptions<ProjectColumn>,
            activeUser: ActiveUserData,
        )
    {
        if (!activeUser.systemAdmin)
        {
            const orgOption: FindOneOptions<ProjectColumn> = {
                where: {
                    project: {
                        organization: {
                            id: activeUser.orgId
                        }
                    }
                }
            };

            setNestedOptions(options ??= {}, orgOption);
        }

        const entity = await this.repository.findOne(options);
        if (!entity)
        {
            throw new NotFoundException(`${ProjectColumn.name} not found`);
        }

        return entity;
    }


    async update
        (
            id: number,
            updateDto: ProjectColumnUpdateDto,
            activeUser: ActiveUserData,
        )
    {
        const entity = await this.findOne(
            {
                where: { id },
            },
            activeUser,
        );

        if (entity.projectType === ProjectType.KANBAN)
        {
            throw new ForbiddenException(`Column of ${ProjectType.KANBAN} project cannot be edited`);
        }

        return createUpdateEntity(
            this._projectsService,
            this.repository,
            updateDto,
            activeUser,
            entity,
        );
    }


    async move
        (
            moveDto: ProjectColumnMoveDto,
            activeUser: ActiveUserData,
        )
    {
        const entity = await this.findOne(
            {
                where: { id: moveDto.id },
            },
            activeUser,
        );

        if (entity.projectType === ProjectType.KANBAN)
        {
            throw new ForbiddenException(`Column of ${ProjectType.KANBAN} project cannot be moved`);
        }

        const projectEntity = await this._projectsService.findOne(
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
            projectEntity.columns.splice(projectEntity.columns.indexOf(column), 1);
            projectEntity.columns.splice(moveDto.ordering, 0, column);
        }
        else
        {
            projectEntity.columns.splice(moveDto.ordering, 0, entity);
        }

        projectEntity.columns.forEach((item, index) =>
        {
            item.ordering = index;
        });

        return this.repository.save(projectEntity.columns);
    }


    async remove
        (
            id: number,
            activeUser: ActiveUserData,
        )
    {
        const entity = await this.findOne(
            {
                where: { id },
            },
            activeUser,
        );

        if (entity.projectType === ProjectType.KANBAN)
        {
            throw new ForbiddenException(`Column of ${ProjectType.KANBAN} project cannot be deleted`);
        }

        return this.repository.remove(entity);
    }
}
