import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { TaskAttachmentCreateDto } from './dto/task-attachment-create.dto';
import { TaskAttachmentQueryDto } from './dto/task-attachment-query.dto';
import { TaskAttachmentPermissions } from './enums/task-attachment-permissions.enum';
import { TaskAttachmentsService } from './task-attachments.service';

@ApiTags('tasks/attachments')
@Controller('tasks/attachments')
export class TaskAttachmentsController
{
    constructor (private readonly _service: TaskAttachmentsService) { }


    @Post()
    @Permission(TaskAttachmentPermissions.Create)
    create
        (
            @Body() createDto: TaskAttachmentCreateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.create(createDto, activeUser);
    }


    @Get()
    @Permission(TaskAttachmentPermissions.Read)
    findAll
        (
            @Query() queryDto: TaskAttachmentQueryDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.findAll(
            {
                where: {
                    task: {
                        id: queryDto.taskId
                    }
                },
            },
            activeUser,
        );
    }


    @Get(':id')
    @Permission(TaskAttachmentPermissions.Read)
    async findOne
        (
            @Param('id', ParseIntPipe) id: number,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.findOne(
            {
                where: { id },
                relations: { task: true }
            },
            activeUser,
        );
    }


    @Delete(':id')
    @Permission(TaskAttachmentPermissions.Delete)
    remove
        (
            @Param('id', ParseIntPipe) id: number,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.remove(id, activeUser);
    }
}
