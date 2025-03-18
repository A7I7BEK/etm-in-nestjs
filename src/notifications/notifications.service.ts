import { Injectable, NotFoundException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Action } from 'src/actions/entities/action.entity';
import { CheckListItem } from 'src/check-list-items/entities/check-list-item.entity';
import { PaginationMeta } from 'src/common/pagination/pagination-meta.class';
import { Pagination } from 'src/common/pagination/pagination.class';
import { setNestedOptions } from 'src/common/utils/set-nested-options.util';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { TaskComment } from 'src/task-comments/entities/task-comment.entity';
import { TasksService } from 'src/tasks/tasks.service';
import { FindOneOptions, Repository } from 'typeorm';
import { NotificationDeleteDto } from './dto/notification-delete.dto';
import { NotificationQueryDto } from './dto/notification-query.dto';
import { NotificationUpdateDto } from './dto/notification-update.dto';
import { Notification } from './entities/notification.entity';
import { NotificationType } from './enums/notification-type.enum';
import { loadQueryBuilder } from './utils/load-query-builder.util';

@Injectable()
export class NotificationsService
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


    findAll
        (
            activeUser: ActiveUserData,
        )
    {
        return this.repository.find({
            where: {
                user: {
                    id: activeUser.sub,
                    organization: {
                        id: activeUser.orgId
                    }
                },
            }
        });
    }


    async findAllWithFilters
        (
            queryDto: NotificationQueryDto,
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

        return new Pagination<Notification>(data, paginationMeta);
    }


    async findOne
        (
            options: FindOneOptions<Notification>,
            activeUser: ActiveUserData,
        )
    {
        if (!activeUser.systemAdmin)
        {
            const orgOption: FindOneOptions<Notification> = {
                where: {
                    user: {
                        organization: {
                            id: activeUser.orgId
                        }
                    },
                }
            };

            setNestedOptions(options ??= {}, orgOption);
        }

        const entity = await this.repository.findOne(options);
        if (!entity)
        {
            throw new NotFoundException(`${Notification.name} not found`);
        }

        return entity;
    }


    async findOneById
        (
            id: number,
            activeUser: ActiveUserData,
        )
    {
        return this.findOne(
            {
                where: {
                    id,
                    user: {
                        id: activeUser.sub,
                    },
                }
            },
            activeUser,
        );
    }


    async update
        (
            dto: NotificationUpdateDto,
            activeUser: ActiveUserData,
        )
    {
        if (dto.allNotification)
        {
            const entityList = await this.findAll(activeUser);

            entityList.forEach(entity => entity.seenAt = new Date());
            return this.repository.save(entityList);
        }
        else
        {
            const entity = await this.findOneById(dto.notificationId, activeUser);

            entity.seenAt = new Date();
            return this.repository.save(entity);
        }
    }


    async remove
        (
            dto: NotificationDeleteDto,
            activeUser: ActiveUserData,
        )
    {
        if (dto.allNotification)
        {
            const entityList = await this.findAll(activeUser);
            return this.repository.remove(entityList);
        }
        else
        {
            const entity = await this.findOneById(dto.notificationId, activeUser);
            return this.repository.remove(entity);
        }
    }
}
