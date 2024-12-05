import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationMeta } from 'src/common/pagination/pagination-meta.class';
import { Pagination } from 'src/common/pagination/pagination.class';
import { setNestedOptions } from 'src/common/utils/set-nested-options.util';
import { EmployeesService } from 'src/employees/employees.service';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { TasksService } from 'src/tasks/tasks.service';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { TaskMemberCreateDto } from './dto/task-member-create.dto';
import { TaskMemberDeleteDto } from './dto/task-member-delete.dto';
import { TaskMemberQueryDto } from './dto/task-member-query.dto';
import { TaskMember } from './entities/task-member.entity';
import { createUpdateEntity } from './utils/create-update-entity.util';
import { loadQueryBuilder } from './utils/load-query-builder.util';

@Injectable()
export class TaskMembersService
{
    constructor (
        @InjectRepository(TaskMember)
        public readonly repository: Repository<TaskMember>,
        @Inject(forwardRef(() => TasksService))
        private readonly _tasksService: TasksService,
        private readonly _employeesService: EmployeesService,
    ) { }


    create
        (
            createDto: TaskMemberCreateDto,
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
            options: FindManyOptions<TaskMember>,
            activeUser: ActiveUserData,
        )
    {
        if (!activeUser.systemAdmin)
        {
            const orgOption: FindManyOptions<TaskMember> = {
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
            queryDto: TaskMemberQueryDto,
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

        return new Pagination<TaskMember>(data, paginationMeta);
    }


    async findOne
        (
            options: FindOneOptions<TaskMember>,
            activeUser: ActiveUserData,
        )
    {
        if (!activeUser.systemAdmin)
        {
            const orgOption: FindOneOptions<TaskMember> = {
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
            throw new NotFoundException(`${TaskMember.name} not found`);
        }

        return entity;
    }


    async remove
        (
            deleteDto: TaskMemberDeleteDto,
            activeUser: ActiveUserData,
        )
    {
        const entity = await this.findOne(
            {
                where: {
                    task: {
                        id: deleteDto.taskId,
                    },
                    employee: {
                        id: deleteDto.employeeId,
                    }
                }
            },
            activeUser,
        );
        return this.repository.remove(entity);
    }
}