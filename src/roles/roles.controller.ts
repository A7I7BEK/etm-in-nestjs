import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { RoleCreateDto } from './dto/role-create.dto';
import { RoleQueryDto } from './dto/role-query.dto';
import { RoleUpdateDto } from './dto/role-update.dto';
import { RolePermissions } from './enum/role-permissions.enum';
import { RolesService } from './roles.service';


@ApiBearerAuth()
@ApiTags('roles')
@Controller('roles')
export class RolesController
{
    constructor (private readonly _service: RolesService) { }


    @Post()
    @Permission(RolePermissions.CREATE)
    create
        (
            @Body() createDto: RoleCreateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.create(createDto, activeUser);
    }


    @Get()
    @Permission(RolePermissions.READ)
    findAll
        (
            @Query() queryDto: RoleQueryDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.findAllWithFilters(queryDto, activeUser);
    }


    @Get(':id')
    @Permission(RolePermissions.READ)
    findOne
        (
            @Param('id', ParseIntPipe) id: number,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.findOne(
            {
                where: { id },
                relations: { organization: true }
            },
            activeUser,
        );
    }


    @Put(':id')
    @Permission(RolePermissions.UPDATE)
    update
        (
            @Param('id', ParseIntPipe) id: number,
            @Body() updateDto: RoleUpdateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.update(id, updateDto, activeUser);
    }


    @Delete(':id')
    @Permission(RolePermissions.DELETE)
    remove
        (
            @Param('id', ParseIntPipe) id: number,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.remove(id, activeUser);
    }
}
