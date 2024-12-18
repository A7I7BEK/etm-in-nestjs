import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { TaskTimerCreateDto } from './dto/task-timer-create.dto';
import { TaskTimerQueryDto } from './dto/task-timer-query.dto';
import { TaskTimerUpdateDto } from './dto/task-timer-update.dto';
import { TaskTimerPermissions } from './enums/task-timer-permissions.enum';
import { TaskTimerService } from './task-timer.service';
import { modifyEntityForFront } from './utils/modify-entity-for-front.util';

@ApiTags('taskTimer')
@Controller('taskTimer')
export class TaskTimerController
{
    constructor (private readonly _service: TaskTimerService) { }


    @Post()
    @Permission(TaskTimerPermissions.Start, TaskTimerPermissions.Stop)
    async create
        (
            @Body() createDto: TaskTimerCreateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.create(createDto, activeUser);
        return modifyEntityForFront(entity);
    }


    @Get()
    @Permission(TaskTimerPermissions.Read)
    async findAll
        (
            @Query() queryDto: TaskTimerQueryDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entityWithPagination = await this._service.findAllWithFilters(queryDto, activeUser);
        entityWithPagination.data = entityWithPagination.data.map(entity => modifyEntityForFront(entity));

        return entityWithPagination;
    }


    @Get(':id')
    @Permission(TaskTimerPermissions.Read)
    async findOne
        (
            @Param('id', ParseIntPipe) id: number,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.findOne(
            {
                where: { id },
                relations: { organization: true }
            },
            activeUser,
        );
        return modifyEntityForFront(entity);
    }
}
