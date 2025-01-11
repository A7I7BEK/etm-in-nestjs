import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationMeta } from 'src/common/pagination/pagination-meta.class';
import { Pagination } from 'src/common/pagination/pagination.class';
import { setNestedOptions } from 'src/common/utils/set-nested-options.util';
import { EmployeesService } from 'src/employees/employees.service';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { TasksService } from 'src/tasks/tasks.service';
import { wsEmitOneTask } from 'src/tasks/utils/ws-emit-one-task.util';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { TaskCommentCreateDto } from './dto/task-comment-create.dto';
import { TaskCommentQueryDto } from './dto/task-comment-query.dto';
import { TaskCommentUpdateDto } from './dto/task-comment-update.dto';
import { TaskComment } from './entities/task-comment.entity';
import { createUpdateEntity } from './utils/create-update-entity.util';
import { loadQueryBuilder } from './utils/load-query-builder.util';

@Injectable()
export class TaskCommentsService
{
    constructor (
        @InjectRepository(TaskComment)
        public readonly repository: Repository<TaskComment>,
        @Inject(forwardRef(() => TasksService))
        private readonly _tasksService: TasksService,
        private readonly _employeesService: EmployeesService,
    ) { }


    create
        (
            createDto: TaskCommentCreateDto,
            activeUser: ActiveUserData,
        )
    {
        return createUpdateEntity(
            this._tasksService,
            this._employeesService,
            this.repository,
            createDto,
            activeUser,
        );
    }


    findAll
        (
            options: FindManyOptions<TaskComment>,
            activeUser: ActiveUserData,
        )
    {
        if (!activeUser.systemAdmin)
        {
            const orgOption: FindManyOptions<TaskComment> = {
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
            queryDto: TaskCommentQueryDto,
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

        return new Pagination<TaskComment>(data, paginationMeta);
    }


    async findOne
        (
            options: FindOneOptions<TaskComment>,
            activeUser: ActiveUserData,
        )
    {
        if (!activeUser.systemAdmin)
        {
            const orgOption: FindOneOptions<TaskComment> = {
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
            throw new NotFoundException(`${TaskComment.name} not found`);
        }

        return entity;
    }


    async update
        (
            id: number,
            updateDto: TaskCommentUpdateDto,
            activeUser: ActiveUserData,
        )
    {
        const entity = await this.findOne(
            {
                where: { id },
                relations: {
                    task: true,
                }
            },
            activeUser,
        );

        return createUpdateEntity(
            this._tasksService,
            this._employeesService,
            this.repository,
            updateDto,
            activeUser,
            entity,
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
                relations: {
                    task: true,
                }
            },
            activeUser,
        );
        await this.repository.remove(entity);

        wsEmitOneTask(
            this._tasksService,
            entity.task.id,
            activeUser,
            'replace',
        );

        return entity;
    }
}
