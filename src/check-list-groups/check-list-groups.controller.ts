import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { CheckListGroupsService } from './check-list-groups.service';
import { CheckListGroupCreateDto } from './dto/check-list-group-create.dto';
import { CheckListGroupQueryDto } from './dto/check-list-group-query.dto';
import { CheckListGroupUpdateDto } from './dto/check-list-group-update.dto';
import { CheckListGroupPermissions } from './enums/check-list-group-permissions.enum';
import { modifyCheckListGroupForFront } from './utils/modify-check-list-group-for-front.util';

@ApiTags('check-list-groups')
@Controller('check-list-groups')
export class CheckListGroupsController
{
    constructor (private readonly _service: CheckListGroupsService) { }


    @Post()
    @Permission(CheckListGroupPermissions.Create)
    async create
        (
            @Body() createDto: CheckListGroupCreateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.create(createDto, activeUser);
        return modifyCheckListGroupForFront(entity);
    }


    @Get()
    @Permission(CheckListGroupPermissions.Read)
    async findAll
        (
            @Query() queryDto: CheckListGroupQueryDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entityWithPagination = await this._service.findAllWithFilters(queryDto, activeUser);
        entityWithPagination.data =
            entityWithPagination.data.map(entity => modifyCheckListGroupForFront(entity));

        return entityWithPagination;
    }


    @Get(':id')
    @Permission(CheckListGroupPermissions.Read)
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
                    checkList: {
                        checkListGroup: true,
                        members: {
                            user: true
                        }
                    },
                    task: true,
                }
            },
            activeUser,
        );
        return modifyCheckListGroupForFront(entity);
    }


    @Put(':id')
    @Permission(CheckListGroupPermissions.Update)
    async update
        (
            @Param('id', ParseIntPipe) id: number,
            @Body() updateDto: CheckListGroupUpdateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.update(id, updateDto, activeUser);
        return modifyCheckListGroupForFront(entity);
    }


    @Delete(':id')
    @Permission(CheckListGroupPermissions.Delete)
    async remove
        (
            @Param('id', ParseIntPipe) id: number,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.remove(id, activeUser);
        return modifyCheckListGroupForFront(entity);
    }
}
