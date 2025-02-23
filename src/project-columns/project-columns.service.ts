import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { setNestedOptions } from 'src/common/utils/set-nested-options.util';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ProjectsService } from 'src/projects/projects.service';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { ProjectColumnCreateDto } from './dto/project-column-create.dto';
import { ProjectColumnMoveDto } from './dto/project-column-move.dto';
import { ProjectColumnUpdateDto } from './dto/project-column-update.dto';
import { ProjectColumn } from './entities/project-column.entity';
import { ProjectColumnsGateway } from './project-columns.gateway';
import { createEntity } from './utils/create-entity.util';
import { deleteEntity } from './utils/delete-entity.util';
import { moveEntity } from './utils/move-entity.util';
import { updateEntity } from './utils/update-entity.util';

@Injectable()
export class ProjectColumnsService
{
    constructor (
        @InjectRepository(ProjectColumn)
        public readonly repository: Repository<ProjectColumn>,
        @Inject(forwardRef(() => ProjectsService)) // BINGO: Circular dependency problem solved
        public readonly projectsService: ProjectsService,
        public readonly columnsGateway: ProjectColumnsGateway,
        public readonly eventEmitter: EventEmitter2,
    ) { }


    create
        (
            createDto: ProjectColumnCreateDto,
            activeUser: ActiveUserData,
        )
    {
        return createEntity(this, createDto, activeUser);
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


    update
        (
            id: number,
            updateDto: ProjectColumnUpdateDto,
            activeUser: ActiveUserData,
        )
    {
        return updateEntity(this, id, updateDto, activeUser);
    }


    move
        (
            moveDto: ProjectColumnMoveDto,
            activeUser: ActiveUserData,
        )
    {
        return moveEntity(
            this, // BINGO: the service can be passed as an Argument
            moveDto,
            activeUser,
        );
    }


    remove
        (
            id: number,
            activeUser: ActiveUserData,
        )
    {
        return deleteEntity(this, id, activeUser);
    }
}
