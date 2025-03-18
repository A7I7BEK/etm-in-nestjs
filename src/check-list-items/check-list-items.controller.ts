import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { CheckListItemsService } from './check-list-items.service';
import { CheckListItemCreateDto } from './dto/check-list-item-create.dto';
import { CheckListItemQueryDto } from './dto/check-list-item-query.dto';
import { CheckListItemUpdateDto } from './dto/check-list-item-update.dto';
import { CheckListItemPermissions } from './enums/check-list-item-permissions.enum';


@ApiBearerAuth()
@ApiTags('check-list-items')
@Controller('check-list-items')
export class CheckListItemsController
{
    constructor (private readonly _service: CheckListItemsService) { }


    @Post()
    @Permission(CheckListItemPermissions.CREATE)
    async create
        (
            @Body() createDto: CheckListItemCreateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.create(createDto, activeUser);
    }


    @Get()
    @Permission(CheckListItemPermissions.READ)
    async findAll
        (
            @Query() queryDto: CheckListItemQueryDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.findAllWithFilters(queryDto, activeUser);
    }


    @Get(':id')
    @Permission(CheckListItemPermissions.READ)
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
                    members: {
                        user: true
                    },
                    checkListGroup: true
                }
            },
            activeUser,
        );
    }


    @Put(':id')
    @Permission(CheckListItemPermissions.UPDATE)
    async update
        (
            @Param('id', ParseIntPipe) id: number,
            @Body() updateDto: CheckListItemUpdateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.update(id, updateDto, activeUser);
    }


    @Delete(':id')
    @Permission(CheckListItemPermissions.DELETE)
    async remove
        (
            @Param('id', ParseIntPipe) id: number,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.remove(id, activeUser);
    }
}
