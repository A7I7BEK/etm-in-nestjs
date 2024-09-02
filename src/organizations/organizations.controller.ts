import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
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
    @Permission(OrganizationsPermission.Create)
    create(@Body() createOrganizationDto: CreateOrganizationDto)
    {
        return this.organizationsService.create(createOrganizationDto);
    }

    @Get()
    @Permission(OrganizationsPermission.Read)
    findAll()
    {
        return this.organizationsService.findAll();
    }

    @Get(':id')
    @Permission(OrganizationsPermission.Read)
    findOne(@Param('id') id: string)
    {
        return this.organizationsService.findOne(+id);
    }

    @Put(':id')
    @Permission(OrganizationsPermission.Update)
    update(@Param('id') id: string, @Body() updateOrganizationDto: UpdateOrganizationDto)
    {
        return this.organizationsService.update(+id, updateOrganizationDto);
    }

    @Delete(':id')
    @Permission(OrganizationsPermission.Delete)
    remove(@Param('id') id: string)
    {
        return this.organizationsService.remove(+id);
    }
}
