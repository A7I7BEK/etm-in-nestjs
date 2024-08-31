import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permissions } from 'src/iam/authorization/decorators/permissions.decorator';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationsPermission } from './enums/organizations-permission.enum';
import { OrganizationsService } from './organizations.service';

@ApiTags('organizations')
@Controller('organizations')
export class OrganizationsController
{
    constructor (private readonly organizationsService: OrganizationsService) { }

    @Post()
    @Permissions(OrganizationsPermission.Create)
    create(@Body() createOrganizationDto: CreateOrganizationDto)
    {
        return this.organizationsService.create(createOrganizationDto);
    }

    @Get()
    @Permissions(OrganizationsPermission.Read)
    findAll()
    {
        return this.organizationsService.findAll();
    }

    @Get(':id')
    @Permissions(OrganizationsPermission.Read)
    findOne(@Param('id') id: string)
    {
        return this.organizationsService.findOne(+id);
    }

    @Put(':id')
    @Permissions(OrganizationsPermission.Update)
    update(@Param('id') id: string, @Body() updateOrganizationDto: UpdateOrganizationDto)
    {
        return this.organizationsService.update(+id, updateOrganizationDto);
    }

    @Delete(':id')
    @Permissions(OrganizationsPermission.Delete)
    remove(@Param('id') id: string)
    {
        return this.organizationsService.remove(+id);
    }
}
