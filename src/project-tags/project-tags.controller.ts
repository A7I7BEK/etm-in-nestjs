import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ProjectTagCreateDto } from './dto/project-tag-create.dto';
import { ProjectTagQueryDto } from './dto/project-tag-query.dto';
import { ProjectTagUpdateDto } from './dto/project-tag-update.dto';
import { ProjectTagPermissions } from './enums/project-tag-permissions.enum';
import { ProjectTagsService } from './project-tags.service';


@ApiBearerAuth()
@ApiTags('project-tags')
@Controller('project-tags')
export class ProjectTagsController
{
    constructor (private readonly _service: ProjectTagsService) { }


    @Post()
    @Permission(ProjectTagPermissions.CREATE)
    async create
        (
            @Body() createDto: ProjectTagCreateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.create(createDto, activeUser);
    }


    @Get()
    @Permission(ProjectTagPermissions.READ)
    async findAll
        (
            @Query() queryDto: ProjectTagQueryDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.findAllWithFilters(queryDto, activeUser);
    }


    @Get(':id')
    @Permission(ProjectTagPermissions.READ)
    async findOne
        (
            @Param('id', ParseIntPipe) id: number,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.findOne(
            {
                where: { id },
                relations: { project: true }
            },
            activeUser,
        );
    }


    @Put(':id')
    @Permission(ProjectTagPermissions.UPDATE)
    async update
        (
            @Param('id', ParseIntPipe) id: number,
            @Body() updateDto: ProjectTagUpdateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.update(id, updateDto, activeUser);
    }


    @Delete(':id')
    @Permission(ProjectTagPermissions.DELETE)
    async remove
        (
            @Param('id', ParseIntPipe) id: number,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.remove(id, activeUser);
    }
}
