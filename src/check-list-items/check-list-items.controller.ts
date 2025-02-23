import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { CheckListItemsService } from './check-list-items.service';
import { CheckListItemCreateDto } from './dto/check-list-item-create.dto';
import { CheckListItemQueryDto } from './dto/check-list-item-query.dto';
import { CheckListItemUpdateDto } from './dto/check-list-item-update.dto';
import { CheckListItemPermissions } from './enums/check-list-item-permissions.enum';
import { modifyCheckListItemForFront } from './utils/modify-check-list-item-for-front.util';

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
        const entity = await this._service.create(createDto, activeUser);
        return modifyCheckListItemForFront(entity);
    }


    @Get()
    @Permission(CheckListItemPermissions.READ)
    async findAll
        (
            @Query() queryDto: CheckListItemQueryDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entityWithPagination = await this._service.findAllWithFilters(queryDto, activeUser);
        entityWithPagination.data = entityWithPagination.data.map(entity => modifyCheckListItemForFront(entity));

        return entityWithPagination;
    }


    @Get(':id')
    @Permission(CheckListItemPermissions.READ)
    async findOne
        (
            @Param('id', ParseIntPipe) id: number,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.findOne(
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
        return modifyCheckListItemForFront(entity);
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
        const entity = await this._service.update(id, updateDto, activeUser);
        return modifyCheckListItemForFront(entity);
    }


    @Delete(':id')
    @Permission(CheckListItemPermissions.DELETE)
    async remove
        (
            @Param('id', ParseIntPipe) id: number,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.remove(id, activeUser);
        return modifyCheckListItemForFront(entity);
    }
}
