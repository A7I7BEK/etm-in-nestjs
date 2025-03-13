import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { OrganizationCreateDto } from './dto/organization-create.dto';
import { OrganizationQueryDto } from './dto/organization-query.dto';
import { OrganizationUpdateDto } from './dto/organization-update.dto';
import { OrganizationPermissions } from './enums/organization-permissions.enum';
import { OrganizationsService } from './organizations.service';


@ApiBearerAuth()
@ApiTags('organizations')
@Controller('organizations')
export class OrganizationsController
{
    constructor (private readonly _service: OrganizationsService) { }


    @Post()
    @Permission(OrganizationPermissions.CREATE)
    create
        (
            @Body() createDto: OrganizationCreateDto,
        )
    {
        return this._service.create(createDto);
    }


    @Get()
    @Permission(OrganizationPermissions.READ)
    findAll
        (
            @Query() queryDto: OrganizationQueryDto,
        )
    {
        return this._service.findAllWithFilters(queryDto);
    }


    @Get(':id')
    @Permission(OrganizationPermissions.READ)
    findOne
        (
            @Param('id', ParseIntPipe) id: number,
        )
    {
        return this._service.findOne({ where: { id } });
    }


    @Put(':id')
    @Permission(OrganizationPermissions.UPDATE)
    update
        (
            @Param('id', ParseIntPipe) id: number,
            @Body() updateDto: OrganizationUpdateDto,
        )
    {
        return this._service.update(id, updateDto);
    }


    @Delete(':id')
    @Permission(OrganizationPermissions.DELETE)
    remove
        (
            @Param('id', ParseIntPipe) id: number,
        )
    {
        return this._service.remove(id);
    }
}
