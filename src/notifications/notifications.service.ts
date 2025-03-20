import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationMeta } from 'src/common/pagination/pagination-meta.class';
import { Pagination } from 'src/common/pagination/pagination.class';
import { setNestedOptions } from 'src/common/utils/set-nested-options.util';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { FindOneOptions, Repository } from 'typeorm';
import { NotificationDeleteDto } from './dto/notification-delete.dto';
import { NotificationQueryDto } from './dto/notification-query.dto';
import { NotificationUpdateDto } from './dto/notification-update.dto';
import { Notification } from './entities/notification.entity';
import { NotificationsGateway } from './gateways/notifications.gateway';
import { loadQueryBuilder } from './utils/load-query-builder.util';


@Injectable()
export class NotificationsService
{
    constructor (
        @InjectRepository(Notification)
        public readonly repository: Repository<Notification>,
        public readonly notifGateway: NotificationsGateway,
    ) { }


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
            await this.repository.save(entityList);
            this.notifGateway.emitReplaceAll(entityList, activeUser.sub);

            return entityList;
        }
        else
        {
            const entity = await this.findOneById(dto.notificationId, activeUser);
            entity.seenAt = new Date();
            await this.repository.save(entity);
            this.notifGateway.emitReplaceOne(entity, activeUser.sub);

            return entity;
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
            const entityListClone = structuredClone(entityList);
            await this.repository.remove(entityList);
            this.notifGateway.emitDeleteAll(entityListClone, activeUser.sub);

            return entityList;
        }
        else
        {
            const entity = await this.findOneById(dto.notificationId, activeUser);
            const entityClone = structuredClone(entity);
            await this.repository.remove(entity);
            this.notifGateway.emitDeleteOne(entityClone, activeUser.sub);

            return entity;
        }
    }
}
