import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ProjectMemberCreateDto } from './dto/project-member-create.dto';
import { ProjectMemberQueryDto } from './dto/project-member-query.dto';
import { ProjectMemberPermissions } from './enums/project-member-permissions.enum';
import { ProjectMembersService } from './project-members.service';
import { modifyProjectMemberForFront } from './utils/modify-entity-for-front.util';

@ApiTags('projectMembers')
@Controller('projectMembers')
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
        return entityList.map(entity => modifyProjectMemberForFront(entity));
    }


    @Get()
    @Permission(ProjectMemberPermissions.Read)
    async findAll
        (
            @Query() queryDto: ProjectMemberQueryDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entityWithPagination = await this._service.findAllWithFilters(queryDto, activeUser);
        entityWithPagination.data = entityWithPagination.data.map(entity => modifyProjectMemberForFront(entity));

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
        return modifyProjectMemberForFront(entity);
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
        return modifyProjectMemberForFront(entity);
    }
}
