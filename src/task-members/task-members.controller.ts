import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { TaskMemberCreateDto } from './dto/task-member-create.dto';
import { TaskMemberDeleteDto } from './dto/task-member-delete.dto';
import { TaskMemberQueryDto } from './dto/task-member-query.dto';
import { TaskMemberPermissions } from './enums/task-member-permissions.enum';
import { TaskMembersService } from './task-members.service';


@ApiBearerAuth()
@ApiTags('task-members')
@Controller('task-members')
export class TaskMembersController
{
    constructor (private readonly _service: TaskMembersService) { }


    @Post()
    @Permission(TaskMemberPermissions.CREATE)
    async create
        (
            @Body() createDto: TaskMemberCreateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.create(createDto, activeUser);
    }


    @Get()
    @Permission(TaskMemberPermissions.READ)
    async findAll
        (
            @Query() queryDto: TaskMemberQueryDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.findAllWithFilters(queryDto, activeUser);
    }


    @Get(':id')
    @Permission(TaskMemberPermissions.READ)
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
                    projectMember: {
                        employee: {
                            user: true,
                        },
                    },
                    task: true,
                }
            },
            activeUser,
        );
    }


    @Delete()
    @Permission(TaskMemberPermissions.DELETE)
    async remove
        (
            @Body() deleteDto: TaskMemberDeleteDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.remove(deleteDto, activeUser);
    }
}
