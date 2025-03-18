import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { TaskAttachmentCreateDto } from './dto/task-attachment-create.dto';
import { TaskAttachmentDeleteDto } from './dto/task-attachment-delete.dto';
import { TaskAttachmentQueryDto } from './dto/task-attachment-query.dto';
import { TaskAttachmentPermissions } from './enums/task-attachment-permissions.enum';
import { TaskAttachmentsService } from './task-attachments.service';


@ApiBearerAuth()
@ApiTags('task-attachments')
@Controller('task-attachments')
export class TaskAttachmentsController
{
    constructor (private readonly _service: TaskAttachmentsService) { }


    @Post()
    @Permission(TaskAttachmentPermissions.CREATE)
    async create
        (
            @Body() createDto: TaskAttachmentCreateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.create(createDto, activeUser);
    }


    @Get()
    @Permission(TaskAttachmentPermissions.READ)
    async findAll
        (
            @Query() queryDto: TaskAttachmentQueryDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.findAllWithFilters(queryDto, activeUser);
    }


    @Get(':id')
    @Permission(TaskAttachmentPermissions.READ)
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
                    file: true,
                    task: true,
                }
            },
            activeUser,
        );
    }


    @Delete()
    @Permission(TaskAttachmentPermissions.DELETE)
    async remove
        (
            @Body() deleteDto: TaskAttachmentDeleteDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.remove(deleteDto, activeUser);
    }
}
