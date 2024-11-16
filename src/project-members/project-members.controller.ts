import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ProjectMemberCreateDto } from './dto/project-member-create.dto';
import { ProjectMemberPageFilterDto } from './dto/project-member-page-filter.dto';
import { ProjectMemberPermissions } from './enums/project-member-permissions.enum';
import { ProjectMembersService } from './project-members.service';
import { modifyEntityForFront } from './utils/modify-entity-for-front.util';

@ApiTags('project-members')
@Controller('project-members')
export class ProjectMembersController
{
    constructor (private readonly _service: ProjectMembersService) { }


    @Post()
    @Permission(ProjectMemberPermissions.Create)
    async create
        (
            @Body() createDto: ProjectMemberCreateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entityList = await this._service.create(createDto, activeUser);
        return entityList.map(entity => modifyEntityForFront(entity));
    }


    @Get()
    @Permission(ProjectMemberPermissions.Read)
    async findAll
        (
            @Query() pageFilterDto: ProjectMemberPageFilterDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entityWithPagination = await this._service.findAllWithFilters(pageFilterDto, activeUser);
        entityWithPagination.data = entityWithPagination.data.map(entity => modifyEntityForFront(entity));

        return entityWithPagination;
    }


    @Get(':id')
    @Permission(ProjectMemberPermissions.Read)
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
                    employee: true,
                    project: true,
                }
            },
            activeUser,
        );
        return modifyEntityForFront(entity);
    }


    @Delete(':id')
    @Permission(ProjectMemberPermissions.Delete)
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