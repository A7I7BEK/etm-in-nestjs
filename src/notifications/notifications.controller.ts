import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { NotificationCreateDto } from './dto/notification-create.dto';
import { NotificationQueryDto } from './dto/notification-query.dto';
import { NotificationUpdateDto } from './dto/notification-update.dto';
import { NotificationPermissions } from './enums/notification-permissions.enum';
import { NotificationsService } from './notifications.service';
import { modifyEntityForFront } from './utils/modify-entity-for-front.util';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController
{
    constructor (private readonly _service: NotificationsService) { }


    @Post()
    @Permission(NotificationPermissions.Create)
    async create
        (
            @Body() createDto: NotificationCreateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.create(createDto, activeUser);
        return modifyEntityForFront(entity);
    }


    @Get()
    @Permission(NotificationPermissions.Read)
    async findAll
        (
            @Query() queryDto: NotificationQueryDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entityWithPagination = await this._service.findAllWithFilters(queryDto, activeUser);
        entityWithPagination.data = entityWithPagination.data.map(entity => modifyEntityForFront(entity));

        return entityWithPagination;
    }


    @Get(':id')
    @Permission(NotificationPermissions.Read)
    async findOne
        (
            @Param('id', ParseIntPipe) id: number,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.findOne(
            {
                where: { id },
                relations: { organization: true }
            },
            activeUser,
        );
        return modifyEntityForFront(entity);
    }


    @Put(':id')
    @Permission(NotificationPermissions.Update)
    async update
        (
            @Param('id', ParseIntPipe) id: number,
            @Body() updateDto: NotificationUpdateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.update(id, updateDto, activeUser);
        return modifyEntityForFront(entity);
    }


    @Delete(':id')
    @Permission(NotificationPermissions.Delete)
    async remove
        (
            @Param('id', ParseIntPipe) id: number,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.remove(id, activeUser);
        return modifyEntityForFront(entity);
    }


    @Put('update/admins')
    @Permission(NotificationPermissions.Update)
    async updateAdminRoles
        (
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.updateAdminRoles(activeUser);
    }
}
