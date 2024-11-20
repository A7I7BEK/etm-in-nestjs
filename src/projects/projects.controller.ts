import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ProjectBackgroundDto } from './dto/project-background.dto';
import { ProjectCreateDto } from './dto/project-create.dto';
import { ProjectPageFilterDto } from './dto/project-page-filter.dto';
import { ProjectSelectPageFilterDto } from './dto/project-select-page-filter.dto';
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
            @Query() pageFilterDto: ProjectPageFilterDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entityWithPagination = await this._service.findAllWithFilters(pageFilterDto, activeUser);
        entityWithPagination.data = entityWithPagination.data.map(entity => modifyEntityForFront(entity));

        return entityWithPagination;
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


    @Get('selection')
    @Permission(ProjectPermissions.Read)
    async findAllForSelect
        (
            @Query() pageFilterDto: ProjectSelectPageFilterDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entityList = await this._service.findAll(
            {
                where: { // TODO: check if working correctly when undefined
                    projectType: pageFilterDto.projectType,
                    organization: {
                        id: pageFilterDto.organizationId,
                    },
                },
                relations: {
                    organization: true,
                }
            },
            activeUser,
        );

        return entityList.map(entity => modifyEntityForFront(entity));
    }


    @Post()
    @Permission(ProjectPermissions.Create)
    async setBackground
        (
            @Body() backgroundDto: ProjectBackgroundDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.setBackground(backgroundDto, activeUser);
        return modifyEntityForFront(entity);
    }
}
