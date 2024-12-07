import { Body, Controller, Delete, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { TaskDeadlineCreateDto } from './dto/task-deadline-create.dto';
import { TaskDeadlineDeleteDto } from './dto/task-deadline-delete.dto';
import { TaskDeadlineUpdateDto } from './dto/task-deadline-update.dto';
import { TaskDeadlinePermissions } from './enums/task-deadline-permissions.enum';
import { TaskDeadlineService } from './task-deadline.service';
import { modifyEntityForFront } from './utils/modify-entity-for-front.util';

@ApiTags('tasks/estimate')
@Controller('tasks/estimate')
export class TaskDeadlineController
{
    constructor (private readonly _service: TaskDeadlineService) { }


    @Post()
    @Permission(TaskDeadlinePermissions.Create)
    async create
        (
            @Body() createDto: TaskDeadlineCreateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.create(createDto, activeUser);
        return modifyEntityForFront(entity);
    }


    @Put()
    @Permission(TaskDeadlinePermissions.Update)
    async update
        (
            @Body() updateDto: TaskDeadlineUpdateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.update(updateDto, activeUser);
        return modifyEntityForFront(entity);
    }


    @Delete()
    @Permission(TaskDeadlinePermissions.Delete)
    async remove
        (
            @Body() deleteDto: TaskDeadlineDeleteDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.remove(deleteDto, activeUser);
        return modifyEntityForFront(entity);
    }
}
