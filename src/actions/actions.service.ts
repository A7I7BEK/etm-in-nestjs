import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationMeta } from 'src/common/pagination/pagination-meta.class';
import { Pagination } from 'src/common/pagination/pagination.class';
import { setNestedOptions } from 'src/common/utils/set-nested-options.util';
import { EmployeesService } from 'src/employees/employees.service';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { TasksService } from 'src/tasks/tasks.service';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { ActionQueryDto } from './dto/action-query.dto';
import { Action } from './entities/action.entity';
import { loadQueryBuilder } from './utils/load-query-builder.util';

@Injectable()
export class ActionsService
{
    constructor (
        @InjectRepository(Action)
        public readonly repository: Repository<Action>,
        public readonly tasksService: TasksService,
        public readonly employeesService: EmployeesService,
    ) { }


    findAll
        (
            options: FindManyOptions<Action>,
            activeUser: ActiveUserData,
        )
    {
        if (!activeUser.systemAdmin)
        {
            const orgOption: FindOneOptions<Action> = {
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
            queryDto: ActionQueryDto,
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

        return new Pagination<Action>(data, paginationMeta);
    }


    async findOne
        (
            options: FindOneOptions<Action>,
            activeUser: ActiveUserData,
        )
    {
        if (!activeUser.systemAdmin)
        {
            const orgOption: FindOneOptions<Action> = {
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
            throw new NotFoundException(`${Action.name} not found`);
        }

        return entity;
    }


    getEmployee(activeUser: ActiveUserData)
    {
        return this.employeesService.findOne(
            {
                where: {
                    user: {
                        id: activeUser.sub
                    },
                },
            },
            activeUser,
        );
    }


    detectChanges<T, K>(dto: T, oldEntity: K): Record<string, any>
    {
        const changes = {};

        Object.keys(dto).forEach(key =>
        {
            if (dto[ key ] === undefined || oldEntity[ key ] === dto[ key ])
            {
                changes[ key ] = null;
            }

            else
            {
                changes[ key ] = { oldValue: oldEntity[ key ], newValue: dto[ key ] };
            }
        });

        return changes;
    }
}
