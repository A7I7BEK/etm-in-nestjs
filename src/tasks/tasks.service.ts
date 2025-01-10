import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationMeta } from 'src/common/pagination/pagination-meta.class';
import { Pagination } from 'src/common/pagination/pagination.class';
import { setNestedOptions } from 'src/common/utils/set-nested-options.util';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ProjectColumnsService } from 'src/project-columns/project-columns.service';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { TaskCopyDto } from './dto/task-copy.dto';
import { TaskCreateDto } from './dto/task-create.dto';
import { TaskMoveDto } from './dto/task-move.dto';
import { TaskQueryDto } from './dto/task-query.dto';
import { TaskUpdateDto } from './dto/task-update.dto';
import { Task } from './entities/task.entity';
import { TasksGateway } from './tasks.gateway';
import { copyEntity } from './utils/copy-entity.util';
import { createEntity } from './utils/create-entity.util';
import { deleteEntity } from './utils/delete-entity.util';
import { getTaskDetails } from './utils/get-task-details.util';
import { loadQueryBuilder } from './utils/load-query-builder.util';
import { moveEntity } from './utils/move-entity.util';
import { updateEntity } from './utils/update-entity.util';


@Injectable()
export class TasksService
{
    constructor (
        @InjectRepository(Task)
        public readonly repository: Repository<Task>,
        public readonly columnsService: ProjectColumnsService,
        public readonly tasksGateway: TasksGateway,
    ) { }


    create
        (
            createDto: TaskCreateDto,
            activeUser: ActiveUserData,
        )
    {
        return createEntity(this, createDto, activeUser);
    }


    async findAll
        (
            options: FindManyOptions<Task>,
            activeUser: ActiveUserData,
        )
    {
        if (!activeUser.systemAdmin)
        {
            const orgOption: FindManyOptions<Task> = {
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
            queryDto: TaskQueryDto,
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

        return new Pagination<Task>(data, paginationMeta);
    }


    async findOne
        (
            options: FindOneOptions<Task>,
            activeUser: ActiveUserData,
        )
    {
        if (!activeUser.systemAdmin)
        {
            const orgOption: FindOneOptions<Task> = {
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
            throw new NotFoundException(`${Task.name} not found`);
        }

        return entity;
    }


    async update
        (
            id: number,
            updateDto: TaskUpdateDto,
            activeUser: ActiveUserData,
        )
    {
        return updateEntity(this, id, updateDto, activeUser);
    }


    async remove
        (
            id: number,
            activeUser: ActiveUserData,
        )
    {
        return deleteEntity(this, id, activeUser);
    }


    copy
        (
            copyDto: TaskCopyDto,
            activeUser: ActiveUserData,
        )
    {
        return copyEntity(this, copyDto, activeUser);
    }


    move
        (
            moveDto: TaskMoveDto,
            activeUser: ActiveUserData,
        )
    {
        return moveEntity(this, moveDto, activeUser);
    }


    getAllDetails
        (
            id: number,
            activeUser: ActiveUserData,
        )
    {
        return getTaskDetails(this, id, activeUser);
    }
}
