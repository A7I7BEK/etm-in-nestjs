import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { TaskCommentCreateDto } from './dto/task-comment-create.dto';
import { TaskCommentQueryDto } from './dto/task-comment-query.dto';
import { TaskCommentUpdateDto } from './dto/task-comment-update.dto';
import { TaskCommentPermissions } from './enums/task-comment-permissions.enum';
import { TaskCommentsService } from './task-comments.service';
import { modifyEntityForFront } from './utils/modify-entity-for-front.util';

@ApiTags('taskComments')
@Controller('taskComments')
export class TaskCommentsController
{
    constructor (private readonly _service: TaskCommentsService) { }


    @Post()
    @Permission(TaskCommentPermissions.Create)
    async create
        (
            @Body() createDto: TaskCommentCreateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.create(createDto, activeUser);
        return modifyEntityForFront(entity);
    }


    @Get()
    @Permission(TaskCommentPermissions.Read)
    async findAll
        (
            @Query() queryDto: TaskCommentQueryDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entityWithPagination = await this._service.findAllWithFilters(queryDto, activeUser);
        entityWithPagination.data = entityWithPagination.data.map(entity => modifyEntityForFront(entity));

        return entityWithPagination;
    }


    @Get(':id')
    @Permission(TaskCommentPermissions.Read)
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
                    author: {
                        user: true,
                    },
                    members: {
                        user: true,
                    },
                    task: true,
                }
            },
            activeUser,
        );
        return modifyEntityForFront(entity);
    }


    @Put(':id')
    @Permission(TaskCommentPermissions.Update)
    async update
        (
            @Param('id', ParseIntPipe) id: number,
            @Body() updateDto: TaskCommentUpdateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.update(id, updateDto, activeUser);
        return modifyEntityForFront(entity);
    }


    @Delete(':id')
    @Permission(TaskCommentPermissions.Delete)
    async remove
        (
            @Param('id', ParseIntPipe) id: number,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.remove(id, activeUser);
        return modifyEntityForFront(entity);
    }
}
