import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { TaskTagCreateDto } from './dto/task-tag-create.dto';
import { TaskTagDeleteDto } from './dto/task-tag-delete.dto';
import { TaskTagQueryDto } from './dto/task-tag-query.dto';
import { TaskTagPermissions } from './enums/task-tag-permissions.enum';
import { TaskTagsService } from './task-tags.service';
import { modifyTaskTagForFront } from './utils/modify-task-tag-for-front.util';

@ApiTags('task-tags')
@Controller('task-tags')
export class TaskTagsController
{
    constructor (private readonly _service: TaskTagsService) { }


    @Post()
    @Permission(TaskTagPermissions.CREATE)
    async create
        (
            @Body() createDto: TaskTagCreateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.create(createDto, activeUser);
        return modifyTaskTagForFront(entity);
    }


    @Get()
    @Permission(TaskTagPermissions.READ)
    async findAll
        (
            @Query() queryDto: TaskTagQueryDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entityWithPagination = await this._service.findAllWithFilters(queryDto, activeUser);
        entityWithPagination.data = entityWithPagination.data.map(entity => modifyTaskTagForFront(entity));

        return entityWithPagination;
    }


    @Get(':id')
    @Permission(TaskTagPermissions.READ)
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
                    task: true,
                    projectTag: true,
                }
            },
            activeUser,
        );
        return modifyTaskTagForFront(entity);
    }


    @Delete()
    @Permission(TaskTagPermissions.DELETE)
    async remove
        (
            @Body() deleteDto: TaskTagDeleteDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.remove(deleteDto, activeUser);
        return modifyTaskTagForFront(entity);
    }
}
