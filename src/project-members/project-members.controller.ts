import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { CreateProjectMemberDto } from './dto/create-project-member.dto';
import { ProjectMemberPageFilterDto } from './dto/project-member-page-filter.dto';
import { ProjectMemberPermissions } from './enums/project-member-permissions.enum';
import { ProjectMembersService } from './project-members.service';
import { returnModifiedEntity } from './utils/return-modified-entity.util';

@ApiTags('project-members')
@Controller('project-members')
export class ProjectMembersController
{
    constructor (private readonly _service: ProjectMembersService) { }


    @Post()
    @Permission(ProjectMemberPermissions.Create)
    async create(
        @Body() createDto: CreateProjectMemberDto,
        @ActiveUser() activeUser: ActiveUserData,
    )
    {
        const entityList = await this._service.create(createDto, activeUser);
        return entityList.map(entity => returnModifiedEntity(entity));
    }


    @Get()
    @Permission(ProjectMemberPermissions.Read)
    async findAll(
        @Query() pageFilterDto: ProjectMemberPageFilterDto,
        @ActiveUser() activeUser: ActiveUserData,
    )
    {
        const paginationWithEntity = await this._service.findAllWithFilters(pageFilterDto, activeUser);
        paginationWithEntity.data = paginationWithEntity.data.map(entity => returnModifiedEntity(entity));

        return paginationWithEntity;
    }


    @Get(':id')
    @Permission(ProjectMemberPermissions.Read)
    async findOne(
        @Param('id', ParseIntPipe) id: number,
        @ActiveUser() activeUser: ActiveUserData,
    )
    {
        const entity = await this._service.findOne(
            activeUser,
            { id },
            {
                employee: true,
                project: true,
            },
        );
        return returnModifiedEntity(entity);
    }


    @Delete(':id')
    @Permission(ProjectMemberPermissions.Delete)
    async remove(
        @Param('id', ParseIntPipe) id: number,
        @ActiveUser() activeUser: ActiveUserData,
    )
    {
        const entity = await this._service.remove(id, activeUser);
        return returnModifiedEntity(entity);
    }
}
