import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationMeta } from 'src/common/pagination/pagination-meta.class';
import { Pagination } from 'src/common/pagination/pagination.class';
import { setNestedOptions } from 'src/common/utils/set-nested-options.util';
import { EmployeesService } from 'src/employees/employees.service';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { TasksService } from 'src/tasks/tasks.service';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { TaskTimerCreateDto } from './dto/task-timer-create.dto';
import { TaskTimerQueryDto } from './dto/task-timer-query.dto';
import { TaskTimer } from './entities/task-timer.entity';
import { TaskTimerStatus } from './enums/task-timer-status.enum';
import { loadQueryBuilder } from './utils/load-query-builder.util';
import { startEntity } from './utils/start-entity.util';
import { stopEntity } from './utils/stop-entity.util';

@Injectable()
export class TaskTimerService
{
    constructor (
        @InjectRepository(TaskTimer)
        public readonly repository: Repository<TaskTimer>,
        public readonly tasksService: TasksService,
        public readonly employeesService: EmployeesService,
        public readonly eventEmitter: EventEmitter2,
    ) { }


    async toggleTimer
        (
            createDto: TaskTimerCreateDto,
            activeUser: ActiveUserData,
        )
    {
        const taskEntity = await this.tasksService.findOne(
            {
                where: { id: createDto.taskId },
                relations: {
                    project: true,
                }
            },
            activeUser,
        );
        const employeeEntity = await this.employeesService.findOne(
            {
                where: {
                    user: {
                        id: activeUser.sub
                    }
                }
            },
            activeUser,
        );

        if (createDto.entryTypeCode === TaskTimerStatus.START)
        {
            return startEntity(this, taskEntity, employeeEntity, activeUser);
        }
        else if (createDto.entryTypeCode === TaskTimerStatus.STOP)
        {
            return stopEntity(this, taskEntity, employeeEntity, activeUser);
        }
    }


    findAll
        (
            options: FindManyOptions<TaskTimer>,
            activeUser: ActiveUserData,
        )
    {
        if (!activeUser.systemAdmin)
        {
            const orgOption: FindManyOptions<TaskTimer> = {
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
            queryDto: TaskTimerQueryDto,
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

        return new Pagination<TaskTimer>(data, paginationMeta);
    }


    async findOne
        (
            options: FindOneOptions<TaskTimer>,
            activeUser: ActiveUserData,
        )
    {
        if (!activeUser.systemAdmin)
        {
            const orgOption: FindOneOptions<TaskTimer> = {
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
            throw new NotFoundException(`${TaskTimer.name} not found`);
        }

        return entity;
    }
}
