import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginationMeta } from 'src/common/pagination/pagination-meta.class';
import { Pagination } from 'src/common/pagination/pagination.class';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { NotificationDeleteDto } from './dto/notification-delete.dto';
import { NotificationQueryDto } from './dto/notification-query.dto';
import { NotificationUpdateDto } from './dto/notification-update.dto';
import { NotificationPermissions } from './enums/notification-permissions.enum';
import { NotificationsService } from './notifications.service';


@ApiBearerAuth()
@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController
{
    constructor (private readonly _service: NotificationsService) { }


    @Get()
    @Permission(NotificationPermissions.READ)
    async findAll
        (
            @Query() queryDto: NotificationQueryDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        if (activeUser.systemAdmin)
        {
            const paginationMeta = new PaginationMeta(queryDto.page, queryDto.pageSize, 0);
            return new Pagination<Notification>([], paginationMeta);
        }

        return this._service.findAllWithFilters(queryDto, activeUser);
    }


    @Get(':id')
    @Permission(NotificationPermissions.READ)
    async findOne
        (
            @Param('id', ParseIntPipe) id: number,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.findOne(
            {
                where: { id },
                relations: {
                    action: {
                        employee: {
                            user: true,
                        },
                        task: true,
                        project: true,
                    },
                }
            },
            activeUser,
        );
    }


    @Post('seen')
    @Permission(NotificationPermissions.UPDATE)
    async update
        (
            @Body() updateDto: NotificationUpdateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.update(updateDto, activeUser);
    }


    @Delete('clear')
    @Permission(NotificationPermissions.DELETE)
    async remove
        (
            @Body() deleteDto: NotificationDeleteDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.remove(deleteDto, activeUser);
    }
}
