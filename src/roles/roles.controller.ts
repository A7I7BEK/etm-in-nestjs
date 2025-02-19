import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { RoleCreateDto } from './dto/role-create.dto';
import { RoleQueryDto } from './dto/role-query.dto';
import { RoleUpdateDto } from './dto/role-update.dto';
import { RolePermissions } from './enum/role-permissions.enum';
import { RolesService } from './roles.service';
import { modifyEntityForFront } from './util/modify-entity-for-front.util';

@ApiTags('roles')
@Controller('roles')
export class RolesController
{
    constructor (private readonly _service: RolesService) { }


    @Post()
    @Permission(RolePermissions.Create)
    async create
        (
            @Body() createDto: RoleCreateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.create(createDto, activeUser);
        return modifyEntityForFront(entity);
    }


    @Get()
    @Permission(RolePermissions.Read)
    async findAll
        (
            @Query() queryDto: RoleQueryDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entityWithPagination = await this._service.findAllWithFilters(queryDto, activeUser);
        entityWithPagination.data.forEach(entity => modifyEntityForFront(entity));

        return entityWithPagination;
    }


    @Get(':id')
    @Permission(RolePermissions.Read)
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
    @Permission(RolePermissions.Update)
    async update
        (
            @Param('id', ParseIntPipe) id: number,
            @Body() updateDto: RoleUpdateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.update(id, updateDto, activeUser);
        return modifyEntityForFront(entity);
    }


    @Delete(':id')
    @Permission(RolePermissions.Delete)
    async remove
        (
            @Param('id', ParseIntPipe) id: number,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.remove(id, activeUser);
        return modifyEntityForFront(entity);
    }


    @Post('update-admins')
    async updateAdminRoles
        (
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.updateAdminRoles(activeUser);
    }
}
