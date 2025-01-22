import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationMeta } from 'src/common/pagination/pagination-meta.class';
import { Pagination } from 'src/common/pagination/pagination.class';
import { setNestedOptions } from 'src/common/utils/set-nested-options.util';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ProjectTagsService } from 'src/project-tags/project-tags.service';
import { TasksService } from 'src/tasks/tasks.service';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { TaskTagCreateDto } from './dto/task-tag-create.dto';
import { TaskTagDeleteDto } from './dto/task-tag-delete.dto';
import { TaskTagQueryDto } from './dto/task-tag-query.dto';
import { TaskTag } from './entities/task-tag.entity';
import { createEntity } from './utils/create-entity.util';
import { deleteEntity } from './utils/delete-entity.util';
import { loadQueryBuilder } from './utils/load-query-builder.util';


@Injectable()
export class TaskTagsService
{
    constructor (
        @InjectRepository(TaskTag)
        public readonly repository: Repository<TaskTag>,
        public readonly tasksService: TasksService,
        public readonly projectTagsService: ProjectTagsService,
        public readonly eventEmitter: EventEmitter2,
    ) { }


    create
        (
            createDto: TaskTagCreateDto,
            activeUser: ActiveUserData,
        )
    {
        return createEntity(this, createDto, activeUser);
    }


    findAll
        (
            options: FindManyOptions<TaskTag>,
            activeUser: ActiveUserData,
        )
    {
        if (!activeUser.systemAdmin)
        {
            const orgOption: FindManyOptions<TaskTag> = {
                where: {
                    task: {
                        project: {
                            organization: {
                                id: activeUser.orgId
                            }
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
            queryDto: TaskTagQueryDto,
            activeUser: ActiveUserData,
        )
    {
        const loadedQueryBuilder = loadQueryBuilder(
            this.repository,
            queryDto,
            activeUser,
        );

        const [ data, total ] = await loadedQueryBuilder.getManyAndCount();
        const paginationMeta = new PaginationMeta(queryDto.page, queryDto.perPage, total);

        return new Pagination<TaskTag>(data, paginationMeta);
    }


    async findOne
        (
            options: FindOneOptions<TaskTag>,
            activeUser: ActiveUserData,
        )
    {
        if (!activeUser.systemAdmin)
        {
            const orgOption: FindOneOptions<TaskTag> = {
                where: {
                    task: {
                        project: {
                            organization: {
                                id: activeUser.orgId
                            }
                        }
                    }
                }
            };

            setNestedOptions(options ??= {}, orgOption);
        }

        const entity = await this.repository.findOne(options);
        if (!entity)
        {
            throw new NotFoundException(`${TaskTag.name} not found`);
        }

        return entity;
    }


    async remove
        (
            deleteDto: TaskTagDeleteDto,
            activeUser: ActiveUserData,
        )
    {
        return deleteEntity(this, deleteDto, activeUser);
    }
}
