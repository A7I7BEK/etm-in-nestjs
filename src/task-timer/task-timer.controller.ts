import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { TaskTimerCreateDto } from './dto/task-timer-create.dto';
import { TaskTimerQueryDto } from './dto/task-timer-query.dto';
import { TaskTimerPermissions } from './enums/task-timer-permissions.enum';
import { TaskTimerService } from './task-timer.service';

@ApiTags('taskTimer')
@Controller('taskTimer')
export class TaskTimerController
{
    constructor (private readonly _service: TaskTimerService) { }


    @Post()
    @Permission(TaskTimerPermissions.Start, TaskTimerPermissions.Stop)
    toggleTimer
        (
            @Body() createDto: TaskTimerCreateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.toggleTimer(createDto, activeUser);
    }


    @Get()
    @Permission(TaskTimerPermissions.Read)
    findAll
        (
            @Query() queryDto: TaskTimerQueryDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.findAllWithFilters(queryDto, activeUser);
    }


    @Get(':id')
    @Permission(TaskTimerPermissions.Read)
    findOne
        (
            @Param('id', ParseIntPipe) id: number,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.findOne(
            {
                where: { id },
                relations: {
                    task: true,
                    employee: {
                        user: true
                    },
                }
            },
            activeUser,
        );
    }
}
