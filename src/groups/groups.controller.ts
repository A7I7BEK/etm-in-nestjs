import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { GroupCreateDto } from './dto/group-create.dto';
import { GroupQueryDto } from './dto/group-query.dto';
import { GroupUpdateDto } from './dto/group-update.dto';
import { GroupPermissions } from './enums/group-permissions.enum';
import { GroupsService } from './groups.service';
import { modifyEntityForFront } from './utils/modify-entity-for-front.util';


@ApiBearerAuth()
@ApiTags('groups')
@Controller('groups')
export class GroupsController
{
    constructor (private readonly _service: GroupsService) { }


    @Post()
    @Permission(GroupPermissions.CREATE)
    async create
        (
            @Body() createDto: GroupCreateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.create(createDto, activeUser);
        return modifyEntityForFront(entity);
    }


    @Get()
    @Permission(GroupPermissions.READ)
    async findAll
        (
            @Query() queryDto: GroupQueryDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entityWithPagination = await this._service.findAllWithFilters(queryDto, activeUser);
        entityWithPagination.data = entityWithPagination.data.map(entity => modifyEntityForFront(entity));

        return entityWithPagination;
    }


    @Get(':id')
    @Permission(GroupPermissions.READ)
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
                    employees: true,
                    leader: true,
                    organization: true,
                }
            },
            activeUser,
        );
        return modifyEntityForFront(entity);
    }


    @Put(':id')
    @Permission(GroupPermissions.UPDATE)
    async update
        (
            @Param('id', ParseIntPipe) id: number,
            @Body() updateDto: GroupUpdateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.update(id, updateDto, activeUser);
        return modifyEntityForFront(entity);
    }


    @Delete(':id')
    @Permission(GroupPermissions.DELETE)
    async remove
        (
            @Param('id', ParseIntPipe) id: number,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.remove(id, activeUser);
        return modifyEntityForFront(entity);
    }
}
