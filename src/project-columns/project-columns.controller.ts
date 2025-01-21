import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ProjectColumnCreateDto } from './dto/project-column-create.dto';
import { ProjectColumnMoveDto } from './dto/project-column-move.dto';
import { ProjectColumnSelectQueryDto } from './dto/project-column-select-query.dto';
import { ProjectColumnUpdateDto } from './dto/project-column-update.dto';
import { ProjectColumnPermissions } from './enums/project-column-permissions.enum';
import { ProjectColumnsService } from './project-columns.service';
import { modifyProjectColumnForFront } from './utils/modify-entity-for-front.util';

@ApiTags('projectColumns')
@Controller('projectColumns')
export class ProjectColumnsController
{
    constructor (private readonly _service: ProjectColumnsService) { }


    @Post()
    @Permission(ProjectColumnPermissions.Create)
    async create
        (
            @Body() createDto: ProjectColumnCreateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.create(createDto, activeUser);
        return modifyProjectColumnForFront(entity);
    }


    @Get('selection')
    @Permission(ProjectColumnPermissions.Read)
    async findAll
        (
            @Query() queryDto: ProjectColumnSelectQueryDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entityList = await this._service.findAll(
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
        return entityList.map(entity => modifyProjectColumnForFront(entity));
    }


    @Get(':id')
    @Permission(ProjectColumnPermissions.Read)
    async findOne
        (
            @Param('id', ParseIntPipe) id: number,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.findOne(
            {
                where: { id },
                relations: { project: true }
            },
            activeUser,
        );
        return modifyProjectColumnForFront(entity);
    }


    @Put(':id')
    @Permission(ProjectColumnPermissions.Update)
    async update
        (
            @Param('id', ParseIntPipe) id: number,
            @Body() updateDto: ProjectColumnUpdateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.update(id, updateDto, activeUser);
        return modifyProjectColumnForFront(entity);
    }


    @Delete(':id')
    @Permission(ProjectColumnPermissions.Delete)
    async remove
        (
            @Param('id', ParseIntPipe) id: number,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.remove(id, activeUser);
        return modifyProjectColumnForFront(entity);
    }


    @Post('move')
    @Permission(ProjectColumnPermissions.Move)
    async move
        (
            @Body() moveDto: ProjectColumnMoveDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.move(moveDto, activeUser);
        return modifyProjectColumnForFront(entity);
    }
}
