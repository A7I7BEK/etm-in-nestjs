import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { TaskCommentCreateDto } from './dto/task-comment-create.dto';
import { TaskCommentQueryDto } from './dto/task-comment-query.dto';
import { TaskCommentUpdateDto } from './dto/task-comment-update.dto';
import { TaskCommentPermissions } from './enums/task-comment-permissions.enum';
import { TaskCommentsService } from './task-comments.service';


@ApiBearerAuth()
@ApiTags('task-comments')
@Controller('task-comments')
export class TaskCommentsController
{
    constructor (private readonly _service: TaskCommentsService) { }


    @Post()
    @Permission(TaskCommentPermissions.CREATE)
    async create
        (
            @Body() createDto: TaskCommentCreateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.create(createDto, activeUser);
    }


    @Get()
    @Permission(TaskCommentPermissions.READ)
    async findAll
        (
            @Query() queryDto: TaskCommentQueryDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.findAllWithFilters(queryDto, activeUser);
    }


    @Get(':id')
    @Permission(TaskCommentPermissions.READ)
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
                    author: {
                        user: true,
                    },
                    employees: {
                        user: true,
                    },
                    task: true,
                }
            },
            activeUser,
        );
    }


    @Put(':id')
    @Permission(TaskCommentPermissions.UPDATE)
    async update
        (
            @Param('id', ParseIntPipe) id: number,
            @Body() updateDto: TaskCommentUpdateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.update(id, updateDto, activeUser);
    }


    @Delete(':id')
    @Permission(TaskCommentPermissions.DELETE)
    async remove
        (
            @Param('id', ParseIntPipe) id: number,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.remove(id, activeUser);
    }
}
