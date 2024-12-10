import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
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
import { createUpdateEntity } from './utils/create-update-entity.util';
import { loadQueryBuilder } from './utils/load-query-builder.util';

@Injectable()
export class TaskTagsService
{
    constructor (
        @InjectRepository(TaskTag)
        public readonly repository: Repository<TaskTag>,
        @Inject(forwardRef(() => TasksService))
        private readonly _tasksService: TasksService,
        private readonly _projectTagsService: ProjectTagsService,
    ) { }


    create
        (
            createDto: TaskTagCreateDto,
            activeUser: ActiveUserData,
        )
    {
        return createUpdateEntity(
            this._tasksService,
            this._projectTagsService,
            this.repository,
            createDto,
            activeUser,
        );
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
        const entity = await this.findOne(
            {
                where: {
                    task: {
                        id: deleteDto.taskId,
                    },
                    projectTag: {
                        id: deleteDto.projectTagId,
                    },
                }
            },
            activeUser,
        );
        return this.repository.remove(entity);
    }
}
