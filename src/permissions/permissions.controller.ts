import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { PermissionPageFilterDto } from './dto/permission-page-filter.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionPermissions } from './enums/permission-permissions.enum';
import { PermissionsService } from './permissions.service';

@ApiTags('permissions')
@Controller('permissions')
export class PermissionsController
{
    constructor (private readonly permissionsService: PermissionsService) { }

    @Post()
    @Permission(PermissionPermissions.Create)
    create(@Body() createPermissionDto: CreatePermissionDto)
    {
        return this.permissionsService.create(createPermissionDto);
    }

    @Get()
    @Permission(PermissionPermissions.Read)
    findAll(@Query() pageFilterDto: PermissionPageFilterDto)
    {
        return this.permissionsService.findAllWithFilters(pageFilterDto);
    }

    @Get(':id')
    @Permission(PermissionPermissions.Read)
    findOne(@Param('id') id: string)
    {
        return this.permissionsService.findOne({ id: +id });
    }

    @Put(':id')
    @Permission(PermissionPermissions.Update)
    update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto)
    {
        return this.permissionsService.update(+id, updatePermissionDto);
    }

    @Delete(':id')
    @Permission(PermissionPermissions.Delete)
    remove(@Param('id') id: string)
    {
        return this.permissionsService.remove(+id);
    }
}
