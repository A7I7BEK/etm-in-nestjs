import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { TaskTagCreateDto } from './dto/task-tag-create.dto';
import { TaskTagDeleteDto } from './dto/task-tag-delete.dto';
import { TaskTagQueryDto } from './dto/task-tag-query.dto';
import { TaskTagPermissions } from './enums/task-tag-permissions.enum';
import { TaskTagsService } from './task-tags.service';


@ApiBearerAuth()
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
        return this._service.create(createDto, activeUser);
    }


    @Get()
    @Permission(TaskTagPermissions.READ)
    async findAll
        (
            @Query() queryDto: TaskTagQueryDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.findAllWithFilters(queryDto, activeUser);
    }


    @Get(':id')
    @Permission(TaskTagPermissions.READ)
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
                    task: true,
                    projectTag: true,
                }
            },
            activeUser,
        );
    }


    @Delete()
    @Permission(TaskTagPermissions.DELETE)
    async remove
        (
            @Body() deleteDto: TaskTagDeleteDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.remove(deleteDto, activeUser);
    }
}
