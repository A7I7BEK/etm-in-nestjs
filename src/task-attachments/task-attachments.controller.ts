import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { TaskAttachmentCreateDto } from './dto/task-attachment-create.dto';
import { TaskAttachmentDeleteDto } from './dto/task-attachment-delete.dto';
import { TaskAttachmentQueryDto } from './dto/task-attachment-query.dto';
import { TaskAttachmentPermissions } from './enums/task-attachment-permissions.enum';
import { TaskAttachmentsService } from './task-attachments.service';
import { modifyTaskAttachmentForFront } from './utils/modify-task-attachment-for-front.util';

@ApiTags('task-attachments')
@Controller('task-attachments')
export class TaskAttachmentsController
{
    constructor (private readonly _service: TaskAttachmentsService) { }


    @Post()
    @Permission(TaskAttachmentPermissions.Create)
    async create
        (
            @Body() createDto: TaskAttachmentCreateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.create(createDto, activeUser);
        return modifyTaskAttachmentForFront(entity);
    }


    @Get()
    @Permission(TaskAttachmentPermissions.Read)
    async findAll
        (
            @Query() queryDto: TaskAttachmentQueryDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entityWithPagination = await this._service.findAllWithFilters(queryDto, activeUser);
        entityWithPagination.data = entityWithPagination.data.map(entity => modifyTaskAttachmentForFront(entity));

        return entityWithPagination;
    }


    @Get(':id')
    @Permission(TaskAttachmentPermissions.Read)
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
                    file: true,
                    task: true,
                }
            },
            activeUser,
        );
        return modifyTaskAttachmentForFront(entity);
    }


    @Delete()
    @Permission(TaskAttachmentPermissions.Delete)
    async remove
        (
            @Body() deleteDto: TaskAttachmentDeleteDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.remove(deleteDto, activeUser);
        return modifyTaskAttachmentForFront(entity);
    }
}
