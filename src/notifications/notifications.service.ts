import { ForbiddenException, Injectable, MethodNotAllowedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationMeta } from 'src/common/pagination/pagination-meta.class';
import { Pagination } from 'src/common/pagination/pagination.class';
import { setNestedOptions } from 'src/common/utils/set-nested-options.util';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { OrganizationPermissions } from 'src/organizations/enums/organization-permissions.enum';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { PermissionPermissions } from 'src/permissions/enums/permission-permissions.enum';
import { PermissionsService } from 'src/permissions/permissions.service';
import { And, Equal, FindManyOptions, FindOneOptions, ILike, Not, Repository } from 'typeorm';
import { NotificationCreateDto } from './dto/notification-create.dto';
import { NotificationQueryDto } from './dto/notification-query.dto';
import { NotificationUpdateDto } from './dto/notification-update.dto';
import { Notification } from './entities/notification.entity';
import { createUpdateEntity } from './utils/create-update-entity.util';
import { loadQueryBuilder } from './utils/load-query-builder.util';

@Injectable()
export class NotificationsService
{
    constructor (
        @InjectRepository(Notification)
        public readonly repository: Repository<Notification>,
        private readonly _organizationsService: OrganizationsService,
        private readonly _permissionsService: PermissionsService,
    ) { }


    create
        (
            createDto: NotificationCreateDto,
            activeUser: ActiveUserData,
        )
    {
        return createUpdateEntity(
            this._organizationsService,
            this._permissionsService,
            this.repository,
            createDto,
            activeUser,
        );
    }


    findAll
        (
            options: FindManyOptions<Notification>,
            activeUser: ActiveUserData,
        )
    {
        if (!activeUser.systemAdmin)
        {
            const orgOption: FindManyOptions<Notification> = {
                where: {
                    organization: {
                        id: activeUser.orgId
                    }
                }
            };

            setNestedOptions(options ??= {}, orgOption); // BINGO
        }

        return this.repository.find(options);
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
        const paginationMeta = new PaginationMeta(queryDto.page, queryDto.perPage, total);

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
                    organization: {
                        id: activeUser.orgId
                    }
                }
            };

            setNestedOptions(options ??= {}, orgOption); // BINGO
        }

        const entity = await this.repository.findOne(options);
        if (!entity)
        {
            throw new NotFoundException(`${Notification.name} not found`);
        }

        return entity;
    }


    async update
        (
            id: number,
            updateDto: NotificationUpdateDto,
            activeUser: ActiveUserData,
        )
    {
        const entity = await this.findOne(
            {
                where: { id }
            },
            activeUser,
        );

        if (entity.systemCreated)
        {
            throw new ForbiddenException('System created Role cannot be edited');
        }

        return createUpdateEntity(
            this._organizationsService,
            this._permissionsService,
            this.repository,
            updateDto,
            activeUser,
            entity,
        );
    }


    async remove
        (
            id: number,
            activeUser: ActiveUserData,
        )
    {
        const entity = await this.findOne(
            {
                where: { id }
            },
            activeUser,
        );

        if (entity.systemCreated)
        {
            throw new ForbiddenException('System created Role cannot be deleted');
        }

        return this.repository.remove(entity);
    }


    async updateAdminRoles
        (
            activeUser: ActiveUserData,
        )
    {
        if (!activeUser.systemAdmin)
        {
            throw new MethodNotAllowedException();
        }

        const entityList = await this.repository.find({
            where: { systemCreated: true }
        });

        const [ organizationWord ] = OrganizationPermissions.Create.split('_');
        const adminPermissions = await this._permissionsService.repository.findBy({
            name: Not(ILike(`${organizationWord}%`)),
            codeName: And(
                Not(Equal(PermissionPermissions.Create)),
                Not(Equal(PermissionPermissions.Update)),
                Not(Equal(PermissionPermissions.Delete)),
            ),
        });

        entityList.forEach(item => { item.permissions = adminPermissions; });
        await this.repository.save(entityList);

        return 1;
    }
}
