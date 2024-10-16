import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionsService } from './permissions.service';

@ApiTags('permissions')
@Controller('permissions')
export class PermissionsController
{
    constructor (private readonly permissionsService: PermissionsService) { }

    @Post()
    create(@Body() createPermissionDto: CreatePermissionDto)
    {
        return this.permissionsService.create(createPermissionDto);
    }

    @Get()
    findAll()
    {
        return this.permissionsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string)
    {
        return this.permissionsService.findOne({ id: +id });
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto)
    {
        return this.permissionsService.update(+id, updatePermissionDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string)
    {
        return this.permissionsService.remove(+id);
    }
}
