import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationMeta } from 'src/common/pagination/pagination-meta.class';
import { Pagination } from 'src/common/pagination/pagination.class';
import { setNestedOptions } from 'src/common/utils/set-nested-options.util';
import { EmployeesService } from 'src/employees/employees.service';
import { Employee } from 'src/employees/entities/employee.entity';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { Task } from 'src/tasks/entities/task.entity';
import { TasksService } from 'src/tasks/tasks.service';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { TaskTimerCreateDto } from './dto/task-timer-create.dto';
import { TaskTimerQueryDto } from './dto/task-timer-query.dto';
import { TaskTimer } from './entities/task-timer.entity';
import { TaskTimerStatus } from './enums/task-timer-status.enum';
import { loadQueryBuilder } from './utils/load-query-builder.util';

@Injectable()
export class TaskTimerService
{
    constructor (
        @InjectRepository(TaskTimer)
        public readonly repository: Repository<TaskTimer>,
        private readonly _tasksService: TasksService,
        private readonly _employeesService: EmployeesService,
    ) { }


    async toggleTimer
        (
            createDto: TaskTimerCreateDto,
            activeUser: ActiveUserData,
        )
    {
        const taskEntity = await this._tasksService.findOne(
            {
                where: { id: createDto.taskId }
            },
            activeUser,
        );
        const employeeEntity = await this._employeesService.findOne(
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
            return this.startTimer(taskEntity, employeeEntity);
        }
        else if (createDto.entryTypeCode === TaskTimerStatus.STOP)
        {
            return this.stopTimer(taskEntity, employeeEntity, activeUser);
        }
    }


    async startTimer
        (
            taskEntity: Task,
            employeeEntity: Employee,
        )
    {
        if (taskEntity.timeEntryType === TaskTimerStatus.START)
        {
            throw new ConflictException(`${TaskTimer.name} already started`);
        }
        taskEntity.timeEntryType = TaskTimerStatus.START;
        await this._tasksService.repository.save(taskEntity);

        const entity = new TaskTimer();
        entity.status = TaskTimerStatus.START;
        entity.time = new Date();
        entity.task = taskEntity;
        entity.employee = employeeEntity;

        return this.repository.save(entity);
    }


    async stopTimer
        (
            taskEntity: Task,
            employeeEntity: Employee,
            activeUser: ActiveUserData,
        )
    {
        if (taskEntity.timeEntryType === TaskTimerStatus.STOP)
        {
            throw new ConflictException(`${TaskTimer.name} already stopped`);
        }

        const taskTimerEntity = await this.findOne(
            {
                where: {
                    task: {
                        id: taskEntity.id
                    },
                    status: TaskTimerStatus.START
                },
                order: {
                    id: 'DESC'
                }
            },
            activeUser,
        );

        const currentTime = new Date();
        const timeSpent = Math.floor(
            (currentTime.getTime() - new Date(taskTimerEntity.time).getTime()) / 1000,
        );

        taskEntity.totalTimeSpent += timeSpent;
        taskEntity.timeEntryType = TaskTimerStatus.STOP;
        await this._tasksService.repository.save(taskEntity);

        const entity = new TaskTimer();
        entity.status = TaskTimerStatus.STOP;
        entity.time = currentTime;
        entity.task = taskEntity;
        entity.employee = employeeEntity;

        return this.repository.save(entity);
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
        const paginationMeta = new PaginationMeta(queryDto.page, queryDto.perPage, total);

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
