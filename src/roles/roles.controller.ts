import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { RolesPermission } from './enums/roles-permission.enum';
import { RolesService } from './roles.service';

@ApiTags('roles')
@Controller('roles')
export class RolesController
{
    constructor (private readonly rolesService: RolesService) { }

    @Post()
    @Permission(RolesPermission.Create)
    async create(@Body() createRoleDto: CreateRoleDto, @ActiveUser() activeUser: ActiveUserData)
    {
        const entity = await this.rolesService.create(createRoleDto, activeUser);
        return this.returnModifiedEntity(entity, true);
    }

    @Get()
    @Permission(RolesPermission.Read)
    findAll()
    {
        return this.rolesService.findAll();
    }

    @Get(':id')
    @Permission(RolesPermission.Read)
    async findOne(@Param('id') id: string)
    {
        const entity = await this.rolesService.findOne({ id: +id });
        return this.returnModifiedEntity(entity);
    }

    @Put(':id')
    @Permission(RolesPermission.Update)
    async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto, @ActiveUser() activeUser: ActiveUserData)
    {
        const entity = await this.rolesService.update(+id, updateRoleDto, activeUser);
        return this.returnModifiedEntity(entity, true);
    }

    @Delete(':id')
    @Permission(RolesPermission.Delete)
    async remove(@Param('id') id: string)
    {
        const entity = await this.rolesService.remove(+id);
        return this.returnModifiedEntity(entity);
    }


    private returnModifiedEntity(entity: Role, organization?: boolean)
    {
        const { organization: org, ...entityRest } = entity;
        const entityNew = { ...entityRest };

        if (organization)
        {
            Object.assign(entityNew, {
                organizationId: org.id,
                organizationName: org.name,
            });
        }

        return entityNew;
    }
}
