import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { CreateRoleDto } from './dto/create-role.dto';
import { RolePageFilterDto } from './dto/role-page-filter.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { RolePermissions } from './enums/role-permissions.enum';
import { RolesService } from './roles.service';

@ApiTags('roles')
@Controller('roles')
export class RolesController
{
    constructor (private readonly rolesService: RolesService) { }

    @Post()
    @Permission(RolePermissions.Create)
    async create(@Body() createRoleDto: CreateRoleDto, @ActiveUser() activeUser: ActiveUserData)
    {
        const entity = await this.rolesService.create(createRoleDto, activeUser);
        return this.returnModifiedEntity(entity);
    }

    @Get()
    @Permission(RolePermissions.Read)
    async findAll(@Query() pageFilterDto: RolePageFilterDto, @ActiveUser() activeUser: ActiveUserData)
    {
        const paginationWithEntity = await this.rolesService.findAllWithFilters(pageFilterDto, activeUser);
        paginationWithEntity.data.forEach(entity => this.returnModifiedEntity(entity));

        return paginationWithEntity;
    }

    @Get(':id')
    @Permission(RolePermissions.Read)
    async findOne(@Param('id') id: string)
    {
        const entity = await this.rolesService.findOne({ id: +id }, { organization: true });
        return this.returnModifiedEntity(entity);
    }

    @Put(':id')
    @Permission(RolePermissions.Update)
    async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto, @ActiveUser() activeUser: ActiveUserData)
    {
        const entity = await this.rolesService.update(+id, updateRoleDto, activeUser);
        return this.returnModifiedEntity(entity);
    }

    @Delete(':id')
    @Permission(RolePermissions.Delete)
    async remove(@Param('id') id: string)
    {
        const entity = await this.rolesService.remove(+id);
        return this.returnModifiedEntity(entity);
    }


    private returnModifiedEntity(entity: Role)
    {
        const { organization } = entity;

        if (organization)
        {
            Object.assign(entity, {
                organizationId: organization.id,
                organizationName: organization.name,
            });
        }

        return entity;
    }
}
