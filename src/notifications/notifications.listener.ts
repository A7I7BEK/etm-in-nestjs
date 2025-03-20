import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Action } from 'src/actions/entities/action.entity';
import { Employee } from 'src/employees/entities/employee.entity';
import { TasksService } from 'src/tasks/tasks.service';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationType } from './enums/notification-type.enum';
import { NotificationsGateway } from './gateways/notifications.gateway';


@Injectable()
export class NotificationsListener
{
    constructor (
        @InjectRepository(Notification)
        public readonly repository: Repository<Notification>,
        public readonly tasksService: TasksService,
        public readonly notifGateway: NotificationsGateway,
    ) { }


    @OnEvent([ Notification.name, NotificationType.TASK ], { async: true })
    async createForTask
        (
            action: Action,
        )
    {
        // Tom updated your task "AAA"

        const taskEntity = await this.tasksService.repository.findOne({
            where: { id: action.task.id },
            relations: {
                members: {
                    projectMember: {
                        employee: {
                            user: true
                        }
                    }
                }
            },
        });

        if (taskEntity.members.length)
        {
            const entityList = taskEntity.members.map(member =>
            {
                const entity = new Notification();
                entity.user = member.projectMember.employee.user;
                entity.action = action;
                entity.type = NotificationType.TASK;

                return entity;
            });

            await this.repository.save(entityList);

            this.emitEntityList(entityList);
        }
    }


    @OnEvent([ Notification.name, NotificationType.COMMENT ], { async: true })
    async createForComment
        (
            action: Action,
            employees: Employee[],
        )
    {
        // Tom mentioned you in comment in task "AAA"

        if (employees?.length)
        {
            const entityList = employees.map(employee =>
            {
                const entity = new Notification();
                entity.user = employee.user;
                entity.action = action;
                entity.type = NotificationType.COMMENT;

                return entity;
            });

            await this.repository.save(entityList);

            this.emitEntityList(entityList);
        }
    }


    @OnEvent([ Notification.name, NotificationType.CHECK_LIST_ITEM ], { async: true })
    async createForCheckListItem
        (
            action: Action,
            employees: Employee[],
        )
    {
        // Tom mentioned you in checklist item "AAA" in task "BBB"

        if (employees?.length)
        {
            const entityList = employees.map(employee =>
            {
                const entity = new Notification();
                entity.user = employee.user;
                entity.action = action;
                entity.type = NotificationType.CHECK_LIST_ITEM;

                return entity;
            });

            await this.repository.save(entityList);

            this.emitEntityList(entityList);
        }
    }


    private emitEntityList(entityList: Notification[])
    {
        entityList.forEach(entity =>
        {
            this.notifGateway.emitInsert(entity, entity.user.id);
        });
    }
}
