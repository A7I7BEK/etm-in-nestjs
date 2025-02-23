import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Action } from 'src/actions/entities/action.entity';
import { BaseSimpleEvent } from 'src/actions/event/base-simple.event';
import { PaginationMeta } from 'src/common/pagination/pagination-meta.class';
import { Pagination } from 'src/common/pagination/pagination.class';
import { setNestedOptions } from 'src/common/utils/set-nested-options.util';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ProjectsService } from 'src/projects/projects.service';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { ProjectTagCreateDto } from './dto/project-tag-create.dto';
import { ProjectTagQueryDto } from './dto/project-tag-query.dto';
import { ProjectTagUpdateDto } from './dto/project-tag-update.dto';
import { ProjectTag } from './entities/project-tag.entity';
import { ProjectTagPermissions } from './enums/project-tag-permissions.enum';
import { createUpdateEntity } from './utils/create-update-entity.util';
import { loadQueryBuilder } from './utils/load-query-builder.util';

@Injectable()
export class ProjectTagsService
{
    constructor (
        @InjectRepository(ProjectTag)
        public readonly repository: Repository<ProjectTag>,
        @Inject(forwardRef(() => ProjectsService)) // BINGO: Circular dependency problem solved
        public readonly projectsService: ProjectsService,
        public readonly eventEmitter: EventEmitter2,
    ) { }


    create
        (
            createDto: ProjectTagCreateDto,
            activeUser: ActiveUserData,
        )
    {
        return createUpdateEntity(this, createDto, activeUser);
    }


    findAll
        (
            options: FindManyOptions<ProjectTag>,
            activeUser: ActiveUserData,
        )
    {
        if (!activeUser.systemAdmin)
        {
            const orgOption: FindManyOptions<ProjectTag> = {
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


    async findAllWithFilters
        (
            queryDto: ProjectTagQueryDto,
            activeUser: ActiveUserData,
        )
    {
        const loadedQueryBuilder = loadQueryBuilder(
            this.repository,
            queryDto,
            activeUser,
        );

        const [ data, total ] = await loadedQueryBuilder.getManyAndCount();
        const paginationMeta = new PaginationMeta(queryDto.page, queryDto.pageSize, total);

        return new Pagination<ProjectTag>(data, paginationMeta);
    }


    async findOne
        (
            options: FindOneOptions<ProjectTag>,
            activeUser: ActiveUserData,
        )
    {
        if (!activeUser.systemAdmin)
        {
            const orgOption: FindOneOptions<ProjectTag> = {
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
            throw new NotFoundException(`${ProjectTag.name} not found`);
        }

        return entity;
    }


    async update
        (
            id: number,
            updateDto: ProjectTagUpdateDto,
            activeUser: ActiveUserData,
        )
    {
        return createUpdateEntity(this, updateDto, activeUser, id);
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
                relations: {
                    project: true,
                }
            },
            activeUser,
        );
        await this.repository.remove(entity);

        entity.id = id;
        const actionData: BaseSimpleEvent<ProjectTag> = {
            entity,
            activeUser,
        };
        this.eventEmitter.emit(
            [ Action.name, ProjectTagPermissions.DELETE ],
            actionData
        );

        return entity;
    }
}
