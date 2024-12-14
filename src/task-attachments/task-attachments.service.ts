import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationMeta } from 'src/common/pagination/pagination-meta.class';
import { Pagination } from 'src/common/pagination/pagination.class';
import { setNestedOptions } from 'src/common/utils/set-nested-options.util';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ResourceService } from 'src/resource/resource.service';
import { TasksService } from 'src/tasks/tasks.service';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { TaskAttachmentCreateDto } from './dto/task-attachment-create.dto';
import { TaskAttachmentDeleteDto } from './dto/task-attachment-delete.dto';
import { TaskAttachmentQueryDto } from './dto/task-attachment-query.dto';
import { TaskAttachment } from './entities/task-attachment.entity';
import { createEntity } from './utils/create-entity.util';
import { loadQueryBuilder } from './utils/load-query-builder.util';

@Injectable()
export class TaskAttachmentsService
{
    constructor (
        @InjectRepository(TaskAttachment)
        public readonly repository: Repository<TaskAttachment>,
        public readonly tasksService: TasksService,
        public readonly resourceService: ResourceService,
    ) { }


    create
        (
            createDto: TaskAttachmentCreateDto,
            activeUser: ActiveUserData,
        )
    {
        return createEntity(this, createDto, activeUser);
    }


    findAll
        (
            options: FindManyOptions<TaskAttachment>,
            activeUser: ActiveUserData,
        )
    {
        if (!activeUser.systemAdmin)
        {
            const orgOption: FindManyOptions<TaskAttachment> = {
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
            queryDto: TaskAttachmentQueryDto,
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

        return new Pagination<TaskAttachment>(data, paginationMeta);
    }


    async findOne
        (
            options: FindOneOptions<TaskAttachment>,
            activeUser: ActiveUserData,
        )
    {
        if (!activeUser.systemAdmin)
        {
            const orgOption: FindOneOptions<TaskAttachment> = {
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
            throw new NotFoundException(`${TaskAttachment.name} not found`);
        }

        return entity;
    }


    async remove
        (
            deleteDto: TaskAttachmentDeleteDto,
            activeUser: ActiveUserData,
        )
    {
        const entity = await this.findOne(
            {
                where: {
                    task: {
                        id: deleteDto.taskId,
                    },
                    file: {
                        id: deleteDto.fileId,
                    }
                }
            },
            activeUser,
        );
        return this.repository.remove(entity);
    }
}
