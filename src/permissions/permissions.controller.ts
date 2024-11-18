import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { PermissionCreateDto } from './dto/permission-create.dto';
import { PermissionPageFilterDto } from './dto/permission-page-filter.dto';
import { PermissionUpdateDto } from './dto/permission-update.dto';
import { PermissionPermissions } from './enums/permission-permissions.enum';
import { PermissionsService } from './permissions.service';

@ApiTags('permissions')
@Controller('permissions')
export class PermissionsController
{
    constructor (private readonly _service: PermissionsService) { }


    @Post()
    @Permission(PermissionPermissions.Create)
    create
        (
            @Body() createDto: PermissionCreateDto,
        )
    {
        return this._service.create(createDto);
    }


    @Get()
    @Permission(PermissionPermissions.Read)
    findAll
        (
            @Query() pageFilterDto: PermissionPageFilterDto,
        )
    {
        return this._service.findAllWithFilters(pageFilterDto);
    }


    @Get(':id')
    @Permission(PermissionPermissions.Read)
    findOne
        (
            @Param('id', ParseIntPipe) id: number,
        )
    {
        return this._service.findOne({ where: { id } });
    }


    @Put(':id')
    @Permission(PermissionPermissions.Update)
    update
        (
            @Param('id', ParseIntPipe) id: number,
            @Body() updateDto: PermissionUpdateDto,
        )
    {
        return this._service.update(id, updateDto);
    }


    @Delete(':id')
    @Permission(PermissionPermissions.Delete)
    remove
        (
            @Param('id', ParseIntPipe) id: number,
        )
    {
        return this._service.remove(id);
    }
}
