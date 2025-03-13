import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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
import { modifyProjectForFront } from './utils/modify-project-for-front.util';


@ApiBearerAuth()
@ApiTags('projects')
@Controller('projects')
export class ProjectsController
{
    constructor (private readonly _service: ProjectsService) { }


    @Post()
    @Permission(ProjectPermissions.CREATE)
    async create
        (
            @Body() createDto: ProjectCreateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.create(createDto, activeUser);
        return modifyProjectForFront(entity);
    }


    @Get()
    @Permission(ProjectPermissions.READ)
    async findAll
        (
            @Query() queryDto: ProjectQueryDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entityWithPagination = await this._service.findAllWithFilters(queryDto, activeUser);
        entityWithPagination.data = entityWithPagination.data.map(entity => modifyProjectForFront(entity));

        return entityWithPagination;
    }


    @Get('selection')
    @Permission(ProjectPermissions.READ)
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

        return entityList.map(entity => modifyProjectForFront(entity));
    }


    @Get(':id')
    @Permission(ProjectPermissions.READ)
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
        return modifyProjectForFront(entity);
    }


    @Put(':id')
    @Permission(ProjectPermissions.UPDATE)
    async update
        (
            @Param('id', ParseIntPipe) id: number,
            @Body() updateDto: ProjectUpdateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.update(id, updateDto, activeUser);
        return modifyProjectForFront(entity);
    }


    @Delete(':id')
    @Permission(ProjectPermissions.DELETE)
    async remove
        (
            @Param('id', ParseIntPipe) id: number,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.remove(id, activeUser);
        return modifyProjectForFront(entity);
    }


    @Post('background')
    @Permission(ProjectPermissions.CHANGE_BACKGROUND)
    async changeBackground
        (
            @Body() backgroundDto: ProjectBackgroundDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.changeBackground(backgroundDto, activeUser);
        return modifyProjectForFront(entity);
    }


    @Get(':id/details')
    @Permission(ProjectPermissions.READ_DETAILS)
    async getAllDetails
        (
            @Param('id', ParseIntPipe) id: number,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.getAllDetails(id, activeUser);
    }
}
