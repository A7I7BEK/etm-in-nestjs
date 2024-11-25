import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ProjectTagCreateDto } from './dto/project-tag-create.dto';
import { ProjectTagQueryDto } from './dto/project-tag-query.dto';
import { ProjectTagUpdateDto } from './dto/project-tag-update.dto';
import { ProjectTagPermissions } from './enums/project-tag-permissions.enum';
import { ProjectTagsService } from './project-tags.service';
import { modifyEntityForFront } from './utils/modify-entity-for-front.util';

@ApiTags('projectTags')
@Controller('projectTags')
export class ProjectTagsController
{
    constructor (private readonly _service: ProjectTagsService) { }


    @Post()
    @Permission(ProjectTagPermissions.Create)
    async create
        (
            @Body() createDto: ProjectTagCreateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.create(createDto, activeUser);
        return modifyEntityForFront(entity);
    }


    @Get()
    @Permission(ProjectTagPermissions.Read)
    async findAll
        (
            @Query() queryDto: ProjectTagQueryDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entityWithPagination = await this._service.findAllWithFilters(queryDto, activeUser);
        entityWithPagination.data = entityWithPagination.data.map(entity => modifyEntityForFront(entity));

        return entityWithPagination;
    }


    @Get(':id')
    @Permission(ProjectTagPermissions.Read)
    async findOne
        (
            @Param('id', ParseIntPipe) id: number,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.findOne(
            {
                where: { id },
                relations: { project: true }
            },
            activeUser,
        );
        return modifyEntityForFront(entity);
    }


    @Put(':id')
    @Permission(ProjectTagPermissions.Update)
    async update
        (
            @Param('id', ParseIntPipe) id: number,
            @Body() updateDto: ProjectTagUpdateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.update(id, updateDto, activeUser);
        return modifyEntityForFront(entity);
    }


    @Delete(':id')
    @Permission(ProjectTagPermissions.Delete)
    async remove
        (
            @Param('id', ParseIntPipe) id: number,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.remove(id, activeUser);
        return modifyEntityForFront(entity);
    }
}
