import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ProjectColumnCreateDto } from './dto/project-column-create.dto';
import { ProjectColumnMoveDto } from './dto/project-column-move.dto';
import { ProjectColumnSelectQueryDto } from './dto/project-column-select-query.dto';
import { ProjectColumnUpdateDto } from './dto/project-column-update.dto';
import { ProjectColumnPermissions } from './enums/project-column-permissions.enum';
import { ProjectColumnsService } from './project-columns.service';


@ApiBearerAuth()
@ApiTags('project-columns')
@Controller('project-columns')
export class ProjectColumnsController
{
    constructor (private readonly _service: ProjectColumnsService) { }


    @Post()
    @Permission(ProjectColumnPermissions.CREATE)
    create
        (
            @Body() createDto: ProjectColumnCreateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.create(createDto, activeUser);
    }


    @Get('selection')
    @Permission(ProjectColumnPermissions.READ)
    findAll
        (
            @Query() queryDto: ProjectColumnSelectQueryDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.findAll(
            {
                where: {
                    project: {
                        id: queryDto.projectId
                    }
                },
                relations: { project: true }
            },
            activeUser,
        );
    }


    @Get(':id')
    @Permission(ProjectColumnPermissions.READ)
    findOne
        (
            @Param('id', ParseIntPipe) id: number,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.findOne(
            {
                where: { id },
                relations: { project: true }
            },
            activeUser,
        );
    }


    @Put(':id')
    @Permission(ProjectColumnPermissions.UPDATE)
    update
        (
            @Param('id', ParseIntPipe) id: number,
            @Body() updateDto: ProjectColumnUpdateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.update(id, updateDto, activeUser);
    }


    @Delete(':id')
    @Permission(ProjectColumnPermissions.DELETE)
    remove
        (
            @Param('id', ParseIntPipe) id: number,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.remove(id, activeUser);
    }


    @Post('move')
    @Permission(ProjectColumnPermissions.MOVE)
    move
        (
            @Body() moveDto: ProjectColumnMoveDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.move(moveDto, activeUser);
    }
}
