import { ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { setNestedOptions } from 'src/common/utils/set-nested-options.util';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ProjectType } from 'src/projects/enums/project-type.enum';
import { ProjectsService } from 'src/projects/projects.service';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { ProjectColumnCreateDto } from './dto/project-column-create.dto';
import { ProjectColumnMoveDto } from './dto/project-column-move.dto';
import { ProjectColumnUpdateDto } from './dto/project-column-update.dto';
import { ProjectColumn } from './entities/project-column.entity';
import { ProjectColumnsGateway } from './project-columns.gateway';
import { createUpdateEntity } from './utils/create-update-entity.util';
import { moveEntity } from './utils/move-entity.util';

@Injectable()
export class ProjectColumnsService
{
    constructor (
        @InjectRepository(ProjectColumn)
        public readonly repository: Repository<ProjectColumn>,
        @Inject(forwardRef(() => ProjectsService)) // BINGO
        public readonly projectsService: ProjectsService,
        public readonly columnsGateway: ProjectColumnsGateway,
    ) { }


    create
        (
            createDto: ProjectColumnCreateDto,
            activeUser: ActiveUserData,
        )
    {
        return createUpdateEntity(
            this.projectsService,
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
            this.projectsService,
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
        return moveEntity(
            this, // BINGO
            moveDto,
            activeUser,
        );
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
