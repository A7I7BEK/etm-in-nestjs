import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ProjectColumnCreateDto } from './dto/project-column-create.dto';
import { ProjectColumnQueryDto } from './dto/project-column-query.dto';
import { ProjectColumnUpdateDto } from './dto/project-column-update.dto';
import { ProjectColumnPermissions } from './enums/project-column-permissions.enum';
import { ProjectColumnsService } from './project-columns.service';
import { modifyEntityForFront } from './utils/modify-entity-for-front.util';

@ApiTags('project-columns')
@Controller('project-columns')
export class ProjectColumnsController
{
    constructor (private readonly _service: ProjectColumnsService) { }


    @Post()
    @Permission(ProjectColumnPermissions.Create)
    async create
        (
            @Body() createDto: ProjectColumnCreateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.create(createDto, activeUser);
        return modifyEntityForFront(entity);
    }


    @Get()
    @Permission(ProjectColumnPermissions.Read)
    async findAll
        (
            @Query() queryDto: ProjectColumnQueryDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entityWithPagination = await this._service.findAllWithFilters(queryDto, activeUser);
        entityWithPagination.data = entityWithPagination.data.map(entity => modifyEntityForFront(entity));

        return entityWithPagination;
    }


    @Get(':id')
    @Permission(ProjectColumnPermissions.Read)
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
    @Permission(ProjectColumnPermissions.Update)
    async update
        (
            @Param('id', ParseIntPipe) id: number,
            @Body() updateDto: ProjectColumnUpdateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.update(id, updateDto, activeUser);
        return modifyEntityForFront(entity);
    }


    @Delete(':id')
    @Permission(ProjectColumnPermissions.Delete)
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
