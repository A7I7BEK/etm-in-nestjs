import { Body, Controller, Delete, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { modifyTaskForFront } from 'src/tasks/utils/modify-task-for-front.util';
import { TaskDeadlineCreateDto } from './dto/task-deadline-create.dto';
import { TaskDeadlineDeleteDto } from './dto/task-deadline-delete.dto';
import { TaskDeadlineUpdateDto } from './dto/task-deadline-update.dto';
import { TaskDeadlinePermissions } from './enums/task-deadline-permissions.enum';
import { TaskDeadlineService } from './task-deadline.service';


@ApiTags('task-deadline')
@Controller('task-deadline')
export class TaskDeadlineController
{
    constructor (private readonly _service: TaskDeadlineService) { }


    @Post()
    @Permission(TaskDeadlinePermissions.CREATE)
    async create
        (
            @Body() createDto: TaskDeadlineCreateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.create(createDto, activeUser);
        return modifyTaskForFront(entity);
    }


    @Put()
    @Permission(TaskDeadlinePermissions.UPDATE)
    async update
        (
            @Body() updateDto: TaskDeadlineUpdateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.update(updateDto, activeUser);
        return modifyTaskForFront(entity);
    }


    @Delete()
    @Permission(TaskDeadlinePermissions.DELETE)
    async remove
        (
            @Body() deleteDto: TaskDeadlineDeleteDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.remove(deleteDto, activeUser);
        return modifyTaskForFront(entity);
    }
}
