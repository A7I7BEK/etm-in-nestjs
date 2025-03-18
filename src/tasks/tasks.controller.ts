import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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
import { calculateTaskStatus } from './utils/calculate-task-status.util';


@ApiBearerAuth()
@ApiTags('tasks')
@Controller('tasks')
export class TasksController
{
    constructor (private readonly _service: TasksService) { }


    @Post()
    @Permission(TaskPermissions.CREATE)
    async create
        (
            @Body() createDto: TaskCreateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.create(createDto, activeUser);
    }


    @Get()
    @Permission(TaskPermissions.READ)
    async findAll
        (
            @Query() queryDto: TaskQueryDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entityWithPagination = await this._service.findAllWithFilters(queryDto, activeUser);
        entityWithPagination.data.forEach(entity => calculateTaskStatus(entity));
        return entityWithPagination;
    }


    @Get(':id')
    @Permission(TaskPermissions.READ)
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
        return calculateTaskStatus(entity);
    }


    @Put(':id')
    @Permission(TaskPermissions.UPDATE)
    async update
        (
            @Param('id', ParseIntPipe) id: number,
            @Body() updateDto: TaskUpdateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.update(id, updateDto, activeUser);
    }


    @Delete(':id')
    @Permission(TaskPermissions.DELETE)
    async remove
        (
            @Param('id', ParseIntPipe) id: number,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.remove(id, activeUser);
    }


    @Post('copy')
    @Permission(TaskPermissions.COPY)
    async copy
        (
            @Body() copyDto: TaskCopyDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.copy(copyDto, activeUser);
    }


    @Post('move')
    @Permission(TaskPermissions.MOVE)
    async move
        (
            @Body() moveDto: TaskMoveDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.move(moveDto, activeUser);
    }


    @Get(':id/details')
    @Permission(TaskPermissions.READ_DETAILS)
    async getAllDetails
        (
            @Param('id', ParseIntPipe) id: number,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.getAllDetails(id, activeUser);
    }
}
