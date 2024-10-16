import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesPermission } from './enums/roles-permission.enum';
import { RolesService } from './roles.service';

@ApiTags('roles')
@Controller('roles')
export class RolesController
{
    constructor (private readonly rolesService: RolesService) { }

    @Post()
    @Permission(RolesPermission.Create)
    create(@Body() createRoleDto: CreateRoleDto, @ActiveUser() activeUser: ActiveUserData)
    {
        return this.rolesService.create(createRoleDto, activeUser);
    }

    @Get()
    @Permission(RolesPermission.Read)
    findAll()
    {
        return this.rolesService.findAll();
    }

    @Get(':id')
    @Permission(RolesPermission.Read)
    findOne(@Param('id') id: string)
    {
        return this.rolesService.findOne({ id: +id });
    }

    @Put(':id')
    @Permission(RolesPermission.Update)
    update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto, @ActiveUser() activeUser: ActiveUserData)
    {
        return this.rolesService.update(+id, updateRoleDto, activeUser);
    }

    @Delete(':id')
    @Permission(RolesPermission.Delete)
    remove(@Param('id') id: string)
    {
        return this.rolesService.remove(+id);
    }
}
