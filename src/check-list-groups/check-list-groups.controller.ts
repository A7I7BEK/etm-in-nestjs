import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { CheckListGroupsService } from './check-list-groups.service';
import { CheckListGroupCreateDto } from './dto/check-list-group-create.dto';
import { CheckListGroupQueryDto } from './dto/check-list-group-query.dto';
import { CheckListGroupUpdateDto } from './dto/check-list-group-update.dto';
import { CheckListGroupPermissions } from './enums/check-list-group-permissions.enum';
import { calculateCheckListGroupPercent } from './utils/calculate-check-list-group-percent.util';


@ApiBearerAuth()
@ApiTags('check-list-groups')
@Controller('check-list-groups')
export class CheckListGroupsController
{
    constructor (private readonly _service: CheckListGroupsService) { }


    @Post()
    @Permission(CheckListGroupPermissions.CREATE)
    async create
        (
            @Body() createDto: CheckListGroupCreateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.create(createDto, activeUser);
    }


    @Get()
    @Permission(CheckListGroupPermissions.READ)
    async findAll
        (
            @Query() queryDto: CheckListGroupQueryDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entityWithPagination = await this._service.findAllWithFilters(queryDto, activeUser);
        entityWithPagination.data.forEach(entity => calculateCheckListGroupPercent(entity));
        return entityWithPagination;
    }


    @Get(':id')
    @Permission(CheckListGroupPermissions.READ)
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
                        employees: {
                            user: true
                        }
                    },
                    task: true,
                },
                order: {
                    checkList: {
                        id: 'ASC',
                    }
                },
            },
            activeUser,
        );
        return calculateCheckListGroupPercent(entity);
    }


    @Put(':id')
    @Permission(CheckListGroupPermissions.UPDATE)
    async update
        (
            @Param('id', ParseIntPipe) id: number,
            @Body() updateDto: CheckListGroupUpdateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.update(id, updateDto, activeUser);
    }


    @Delete(':id')
    @Permission(CheckListGroupPermissions.DELETE)
    async remove
        (
            @Param('id', ParseIntPipe) id: number,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.remove(id, activeUser);
    }
}
