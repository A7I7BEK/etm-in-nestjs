import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { TaskCopyDto } from './dto/task-copy.dto';
import { TaskCreateDto } from './dto/task-create.dto';
import { TaskMoveDto } from './dto/task-move.dto';
import { TaskQueryDto } from './dto/task-query.dto';
import { TaskUpdateDto } from './dto/task-update.dto';
import { TaskPermissions } from './enums/task-permissions.enum';
import { TasksService } from './tasks.service';
import { modifyTaskForFront } from './utils/modify-task-for-front.util';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController
{
    constructor (private readonly _service: TasksService) { }


    @Post()
    @Permission(TaskPermissions.Create)
    async create
        (
            @Body() createDto: TaskCreateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.create(createDto, activeUser);
        return modifyTaskForFront(entity);
    }


    @Get()
    @Permission(TaskPermissions.Read)
    async findAll
        (
            @Query() queryDto: TaskQueryDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entityWithPagination = await this._service.findAllWithFilters(queryDto, activeUser);
        entityWithPagination.data = entityWithPagination.data.map(entity => modifyTaskForFront(entity));

        return entityWithPagination;
    }


    @Get(':id')
    @Permission(TaskPermissions.Read)
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
                    column: true,
                    project: true,
                },
            },
            activeUser,
        );
        return modifyTaskForFront(entity);
    }


    @Put(':id')
    @Permission(TaskPermissions.Update)
    async update
        (
            @Param('id', ParseIntPipe) id: number,
            @Body() updateDto: TaskUpdateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.update(id, updateDto, activeUser);
        return modifyTaskForFront(entity);
    }


    @Delete(':id')
    @Permission(TaskPermissions.Delete)
    async remove
        (
            @Param('id', ParseIntPipe) id: number,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.remove(id, activeUser);
        return modifyTaskForFront(entity);
    }


    @Post('copy')
    @Permission(TaskPermissions.Copy)
    async copy
        (
            @Body() copyDto: TaskCopyDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.copy(copyDto, activeUser);
        return modifyTaskForFront(entity);
    }


    @Post('move')
    @Permission(TaskPermissions.Move)
    async move
        (
            @Body() moveDto: TaskMoveDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.move(moveDto, activeUser);
        return modifyTaskForFront(entity);
    }
}
