import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ProjectMemberCreateDto } from './dto/project-member-create.dto';
import { ProjectMemberQueryDto } from './dto/project-member-query.dto';
import { ProjectMemberPermissions } from './enums/project-member-permissions.enum';
import { ProjectMembersService } from './project-members.service';


@ApiBearerAuth()
@ApiTags('project-members')
@Controller('project-members')
export class ProjectMembersController
{
    constructor (private readonly _service: ProjectMembersService) { }


    @Post()
    @Permission(ProjectMemberPermissions.CREATE)
    async create
        (
            @Body() createDto: ProjectMemberCreateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.create(createDto, activeUser);
    }


    @Get()
    @Permission(ProjectMemberPermissions.READ)
    async findAll
        (
            @Query() queryDto: ProjectMemberQueryDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.findAllWithFilters(queryDto, activeUser);
    }


    @Get(':id')
    @Permission(ProjectMemberPermissions.READ)
    async findOne
        (
            @Param('id', ParseIntPipe) id: number,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.findOne(
            {
                where: { id },
                relations: {
                    employee: {
                        user: true,
                    },
                    project: true,
                }
            },
            activeUser,
        );
    }


    @Delete(':id')
    @Permission(ProjectMemberPermissions.DELETE)
    async remove
        (
            @Param('id', ParseIntPipe) id: number,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.remove(id, activeUser);
    }
}
