import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmployeesService } from 'src/employees/employees.service';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { TaskCreateDto } from 'src/tasks/dto/task-create.dto';
import { TaskUpdateDto } from 'src/tasks/dto/task-update.dto';
import { Task } from 'src/tasks/entities/task.entity';
import { TaskPermissions } from 'src/tasks/enums/task-permissions.enum';
import { TasksService } from 'src/tasks/tasks.service';
import { ActionsService } from '../actions.service';
import { Action } from '../entities/action.entity';
import { BaseCreateEvent } from '../event/base-create.event';
import { BaseUpdateEvent } from '../event/base-update.event';


@Injectable()
export class TaskListener
{
    constructor (
        private readonly actionsService: ActionsService,
        private readonly tasksService: TasksService,
        private readonly employeesService: EmployeesService,
    ) { }


    @OnEvent([ Action.name, TaskPermissions.Create ], { async: true })
    async listenCreateEvent(data: BaseCreateEvent<Task, TaskCreateDto>)
    {
        const { entity, dto, activeUser } = data;

        const action = new Action();
        action.createdAt = new Date();
        action.activityType = TaskPermissions.Create;
        action.employee = await this.getEmployee(activeUser);
        action.task = entity;
        action.project = entity.project;

        dto[ 'column' ] = { id: entity.column.id, name: entity.column.name };
        dto[ 'project' ] = { id: entity.project.id, name: entity.project.name };
        delete dto.columnId;
        delete dto.projectId;
        action.details = dto;

        await this.actionsService.repository.save(action);
    }


    @OnEvent([ Action.name, TaskPermissions.Update ], { async: true })
    async listenUpdateEvent(data: BaseUpdateEvent<Task, TaskUpdateDto>)
    {
        const { oldEntity, dto, activeUser } = data;

        const action = new Action();
        action.createdAt = new Date();
        action.activityType = TaskPermissions.Update;
        action.details = this.detectChanges(dto, oldEntity);
        action.employee = await this.getEmployee(activeUser);
        action.task = oldEntity;
        action.project = oldEntity.project;

        await this.actionsService.repository.save(action);
    }



    private detectChanges(dto: TaskUpdateDto, oldEntity: Task)
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


    private getEmployee(activeUser: ActiveUserData)
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
}