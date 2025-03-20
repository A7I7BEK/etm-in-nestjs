import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationMeta } from 'src/common/pagination/pagination-meta.class';
import { Pagination } from 'src/common/pagination/pagination.class';
import { setNestedOptions } from 'src/common/utils/set-nested-options.util';
import { EmployeesService } from 'src/employees/employees.service';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { ACTION_NOTIFICATION_MAPPER } from './constants/action-notification-mapper.constant';
import { ActionQueryDto } from './dto/action-query.dto';
import { Action } from './entities/action.entity';
import { loadQueryBuilder } from './utils/load-query-builder.util';

@Injectable()
export class ActionsService
{
    constructor (
        @InjectRepository(Action)
        public readonly repository: Repository<Action>,
        public readonly employeesService: EmployeesService,
        public readonly eventEmitter: EventEmitter2,
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
        const paginationMeta = new PaginationMeta(queryDto.page, queryDto.pageSize, total);

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


    async saveAction(action: Action, data?: any)
    {
        await this.repository.save(action);

        this.eventEmitter.emit(
            [
                Notification.name,
                ACTION_NOTIFICATION_MAPPER[ action.activityType ]
            ],
            action,
            data,
        );
    }
}
