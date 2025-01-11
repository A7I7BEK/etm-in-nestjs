import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationMeta } from 'src/common/pagination/pagination-meta.class';
import { Pagination } from 'src/common/pagination/pagination.class';
import { setNestedOptions } from 'src/common/utils/set-nested-options.util';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ProjectMembersService } from 'src/project-members/project-members.service';
import { TasksService } from 'src/tasks/tasks.service';
import { wsEmitOneTask } from 'src/tasks/utils/ws-emit-one-task.util';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { TaskMemberCreateDto } from './dto/task-member-create.dto';
import { TaskMemberDeleteDto } from './dto/task-member-delete.dto';
import { TaskMemberQueryDto } from './dto/task-member-query.dto';
import { TaskMember } from './entities/task-member.entity';
import { createEntity } from './utils/create-entity.util';
import { loadQueryBuilder } from './utils/load-query-builder.util';

@Injectable()
export class TaskMembersService
{
    constructor (
        @InjectRepository(TaskMember)
        public readonly repository: Repository<TaskMember>,
        public readonly tasksService: TasksService,
        public readonly projectMembersService: ProjectMembersService,
    ) { }


    create
        (
            createDto: TaskMemberCreateDto,
            activeUser: ActiveUserData,
        )
    {
        return createEntity(this, createDto, activeUser);
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
                    projectMember: {
                        id: deleteDto.projectMemberId,
                    }
                }
            },
            activeUser,
        );
        await this.repository.remove(entity);

        wsEmitOneTask(
            this.tasksService,
            deleteDto.taskId,
            activeUser,
            'replace',
        );

        return entity;
    }
}
