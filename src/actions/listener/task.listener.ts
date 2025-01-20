import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmployeesService } from 'src/employees/employees.service';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { TaskUpdateDto } from 'src/tasks/dto/task-update.dto';
import { Task } from 'src/tasks/entities/task.entity';
import { TaskPermissions } from 'src/tasks/enums/task-permissions.enum';
import { TasksService } from 'src/tasks/tasks.service';
import { ActionsService } from '../actions.service';
import { Action } from '../entities/action.entity';
import { BaseUpdateEvent } from '../event/base-update.event';


@Injectable()
export class TaskListener
{
    constructor (
        private readonly actionsService: ActionsService,
        private readonly tasksService: TasksService,
        private readonly employeesService: EmployeesService,
    ) { }


    @OnEvent([ Action.name, TaskPermissions.Update ], { async: true })
    async listenUpdateEvent(data: BaseUpdateEvent<Task, TaskUpdateDto>)
    {
        const { oldEntity, dto, activeUser } = data;

        const action = new Action();
        action.createdAt = new Date();
        action.activityType = TaskPermissions.Update;
        action.details = this.detectChanges(dto, oldEntity);
        action.employee = await this.getEmployee(activeUser);
        action.task = await this.getTask(oldEntity.id, activeUser);
        action.project = action.task.project;

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


    private getTask(id: number, activeUser: ActiveUserData)
    {
        return this.tasksService.findOne(
            {
                where: { id },
                relations: {
                    project: true,
                },
            },
            activeUser,
        );
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