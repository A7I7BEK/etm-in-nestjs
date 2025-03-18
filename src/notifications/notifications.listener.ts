import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Action } from 'src/actions/entities/action.entity';
import { CheckListItem } from 'src/check-list-items/entities/check-list-item.entity';
import { TaskComment } from 'src/task-comments/entities/task-comment.entity';
import { TasksService } from 'src/tasks/tasks.service';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationType } from './enums/notification-type.enum';


@Injectable()
export class NotificationsListener
{
    constructor (
        @InjectRepository(Notification)
        public readonly repository: Repository<Notification>,
        public readonly tasksService: TasksService,
    ) { }


    @OnEvent([ Notification.name, NotificationType.TASK ], { async: true })
    async createForTask
        (
            action: Action,
        )
    {
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
        }
    }


    @OnEvent([ Notification.name, NotificationType.COMMENT ], { async: true })
    async createForComment
        (
            action: Action,
        )
    {
        const comment: TaskComment = action.details?.comment;

        if (comment?.employees?.length)
        {
            const entityList = comment.employees.map(employee =>
            {
                const entity = new Notification();
                entity.user = employee.user;
                entity.action = action;
                entity.type = NotificationType.COMMENT;

                return entity;
            });

            await this.repository.save(entityList);
        }
    }


    @OnEvent([ Notification.name, NotificationType.CHECK_LIST_ITEM ], { async: true })
    async createForCheckListItem
        (
            action: Action,
        )
    {
        const checkListItem: CheckListItem = action.details?.checkListItem;

        if (checkListItem?.employees?.length)
        {
            const entityList = checkListItem.employees.map(employee =>
            {
                const entity = new Notification();
                entity.user = employee.user;
                entity.action = action;
                entity.type = NotificationType.CHECK_LIST_ITEM;

                return entity;
            });

            await this.repository.save(entityList);
        }
    }
}
