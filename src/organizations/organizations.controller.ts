import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { OrganizationPageFilterDto } from './dto/organization-page-filter.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationPermissions } from './enums/organization-permissions.enum';
import { OrganizationsService } from './organizations.service';

@ApiTags('organizations')
@Controller('organizations')
export class OrganizationsController
{
    constructor (private readonly organizationsService: OrganizationsService) { }

    @Post()
    @Permission(OrganizationPermissions.Create)
    create(@Body() createOrganizationDto: CreateOrganizationDto)
    {
        return this.organizationsService.create(createOrganizationDto);
    }

    @Get()
    @Permission(OrganizationPermissions.Read)
    findAll(@Query() pageFilterDto: OrganizationPageFilterDto)
    {
        return this.organizationsService.findAllWithFilters(pageFilterDto);
    }

    @Get(':id')
    @Permission(OrganizationPermissions.Read)
    findOne(@Param('id') id: string)
    {
        return this.organizationsService.findOne({ id: +id });
    }

    @Put(':id')
    @Permission(OrganizationPermissions.Update)
    update(@Param('id') id: string, @Body() updateOrganizationDto: UpdateOrganizationDto)
    {
        return this.organizationsService.update(+id, updateOrganizationDto);
    }

    @Delete(':id')
    @Permission(OrganizationPermissions.Delete)
    remove(@Param('id') id: string)
    {
        return this.organizationsService.remove(+id);
    }
}
