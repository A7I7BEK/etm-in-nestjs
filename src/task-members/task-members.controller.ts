import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { TaskMemberCreateDto } from './dto/task-member-create.dto';
import { TaskMemberDeleteDto } from './dto/task-member-delete.dto';
import { TaskMemberQueryDto } from './dto/task-member-query.dto';
import { TaskMemberPermissions } from './enums/task-member-permissions.enum';
import { TaskMembersService } from './task-members.service';
import { modifyEntityForFront } from './utils/modify-entity-for-front.util';

@ApiTags('taskMembers')
@Controller('taskMembers')
export class TaskMembersController
{
    constructor (private readonly _service: TaskMembersService) { }


    @Post()
    @Permission(TaskMemberPermissions.Create)
    async create
        (
            @Body() createDto: TaskMemberCreateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.create(createDto, activeUser);
        return modifyEntityForFront(entity);
    }


    @Get()
    @Permission(TaskMemberPermissions.Read)
    async findAll
        (
            @Query() queryDto: TaskMemberQueryDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entityWithPagination = await this._service.findAllWithFilters(queryDto, activeUser);
        entityWithPagination.data = entityWithPagination.data.map(entity => modifyEntityForFront(entity));

        return entityWithPagination;
    }


    @Get(':id')
    @Permission(TaskMemberPermissions.Read)
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
                    task: true,
                }
            },
            activeUser,
        );
        return modifyEntityForFront(entity);
    }


    @Delete()
    @Permission(TaskMemberPermissions.Delete)
    async remove
        (
            @Body() deleteDto: TaskMemberDeleteDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.remove(deleteDto, activeUser);
        return modifyEntityForFront(entity);
    }
}
