import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ProjectBackgroundDto } from './dto/project-background.dto';
import { ProjectCreateDto } from './dto/project-create.dto';
import { ProjectQueryDto } from './dto/project-query.dto';
import { ProjectSelectQueryDto } from './dto/project-select-query.dto';
import { ProjectUpdateDto } from './dto/project-update.dto';
import { ProjectPermissions } from './enums/project-permissions.enum';
import { ProjectsService } from './projects.service';
import { modifyEntityForFront } from './utils/modify-entity-for-front.util';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController
{
    constructor (private readonly _service: ProjectsService) { }


    @Post()
    @Permission(ProjectPermissions.Create)
    async create
        (
            @Body() createDto: ProjectCreateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.create(createDto, activeUser);
        return modifyEntityForFront(entity);
    }


    @Get()
    @Permission(ProjectPermissions.Read)
    async findAll
        (
            @Query() queryDto: ProjectQueryDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entityWithPagination = await this._service.findAllWithFilters(queryDto, activeUser);
        entityWithPagination.data = entityWithPagination.data.map(entity => modifyEntityForFront(entity));

        return entityWithPagination;
    }


    @Get('selection')
    @Permission(ProjectPermissions.Read)
    async findAllForSelect
        (
            @Query() queryDto: ProjectSelectQueryDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entityList = await this._service.findAll(
            {
                where: {
                    projectType: queryDto.projectType,
                    organization: {
                        id: queryDto.organizationId,
                    },
                },
                relations: {
                    organization: true,
                },
                order: {
                    id: 'ASC'
                },
            },
            activeUser,
        );

        return entityList.map(entity => modifyEntityForFront(entity));
    }


    @Get(':id')
    @Permission(ProjectPermissions.Read)
    async findOne
        (
            @Param('id', ParseIntPipe) id: number,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.findOne(
            {
                where: { id },
                relations: {
                    group: true,
                    members: {
                        employee: {
                            user: true
                        },
                    },
                    manager: true,
                    organization: true,
                }

            },
            activeUser,
        );
        return modifyEntityForFront(entity);
    }


    @Put(':id')
    @Permission(ProjectPermissions.Update)
    async update
        (
            @Param('id', ParseIntPipe) id: number,
            @Body() updateDto: ProjectUpdateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.update(id, updateDto, activeUser);
        return modifyEntityForFront(entity);
    }


    @Delete(':id')
    @Permission(ProjectPermissions.Delete)
    async remove
        (
            @Param('id', ParseIntPipe) id: number,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.remove(id, activeUser);
        return modifyEntityForFront(entity);
    }


    @Post('background')
    @Permission(ProjectPermissions.ChangeBackground)
    async changeBackground
        (
            @Body() backgroundDto: ProjectBackgroundDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.changeBackground(backgroundDto, activeUser);
        return modifyEntityForFront(entity);
    }
}
