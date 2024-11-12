import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { CreateRoleDto } from './dto/create-role.dto';
import { RolePageFilterDto } from './dto/role-page-filter.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolePermissions } from './enums/role-permissions.enum';
import { RolesService } from './roles.service';
import { returnModifiedEntity } from './utils/return-modified-entity.util';

@ApiTags('roles')
@Controller('roles')
export class RolesController
{
    constructor (private readonly _service: RolesService) { }

    @Post()
    @Permission(RolePermissions.Create)
    async create(
        @Body() createDto: CreateRoleDto,
        @ActiveUser() activeUser: ActiveUserData,
    )
    {
        const entity = await this._service.create(createDto, activeUser);
        return returnModifiedEntity(entity);
    }

    @Get()
    @Permission(RolePermissions.Read)
    async findAll(
        @Query() pageFilterDto: RolePageFilterDto,
        @ActiveUser() activeUser: ActiveUserData,
    )
    {
        const paginationWithEntity = await this._service.findAllWithFilters(pageFilterDto, activeUser);
        paginationWithEntity.data = paginationWithEntity.data.map(entity => returnModifiedEntity(entity));

        return paginationWithEntity;
    }

    @Get(':id')
    @Permission(RolePermissions.Read)
    async findOne(
        @Param('id', ParseIntPipe) id: number,
        @ActiveUser() activeUser: ActiveUserData,
    )
    {
        const entity = await this._service.findOne(activeUser, { id }, { organization: true });
        return returnModifiedEntity(entity);
    }

    @Put(':id')
    @Permission(RolePermissions.Update)
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateDto: UpdateRoleDto,
        @ActiveUser() activeUser: ActiveUserData,
    )
    {
        const entity = await this._service.update(id, updateDto, activeUser);
        return returnModifiedEntity(entity);
    }

    @Delete(':id')
    @Permission(RolePermissions.Delete)
    async remove(
        @Param('id', ParseIntPipe) id: number,
        @ActiveUser() activeUser: ActiveUserData,
    )
    {
        const entity = await this._service.remove(id, activeUser);
        return returnModifiedEntity(entity);
    }
}
