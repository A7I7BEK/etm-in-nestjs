import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectPageFilterDto } from './dto/project-page-filter.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectPermissions } from './enums/project-permissions.enum';
import { ProjectsService } from './projects.service';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController
{
    constructor (private readonly projectsService: ProjectsService) { }

    @Post()
    @Permission(ProjectPermissions.Create)
    create(@Body() createProjectDto: CreateProjectDto, @ActiveUser() activeUser: ActiveUserData)
    {
        return this.projectsService.create(createProjectDto, activeUser);
    }

    @Get()
    @Permission(ProjectPermissions.Read)
    findAll(@Query() pageFilterDto: ProjectPageFilterDto, @ActiveUser() activeUser: ActiveUserData)
    {
        return this.projectsService.findAllWithFilters(pageFilterDto, activeUser);
    }

    @Get(':id')
    @Permission(ProjectPermissions.Read)
    findOne(@Param('id') id: string)
    {
        return this.projectsService.findOne({ id: +id });
    }

    @Put(':id')
    @Permission(ProjectPermissions.Update)
    update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto, @ActiveUser() activeUser: ActiveUserData)
    {
        return this.projectsService.update(+id, updateProjectDto, activeUser);
    }

    @Delete(':id')
    @Permission(ProjectPermissions.Delete)
    remove(@Param('id') id: string)
    {
        return this.projectsService.remove(+id);
    }
}
