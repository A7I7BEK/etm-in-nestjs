import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { CreateGroupDto } from './dto/create-group.dto';
import { GroupPageFilterDto } from './dto/group-page-filter.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './entities/group.entity';
import { GroupPermissions } from './enums/group-permissions.enum';
import { GroupsService } from './groups.service';

@ApiTags('groups')
@Controller('groups')
export class GroupsController
{
    constructor (private readonly groupsService: GroupsService) { }

    @Post()
    @Permission(GroupPermissions.Create)
    async create(@Body() createGroupDto: CreateGroupDto, @ActiveUser() activeUser: ActiveUserData)
    {
        const entity = await this.groupsService.create(createGroupDto, activeUser);
        return this.returnModifiedEntity(entity);
    }

    @Get()
    @Permission(GroupPermissions.Read)
    async findAll(@Query() pageFilterDto: GroupPageFilterDto, @ActiveUser() activeUser: ActiveUserData)
    {
        const paginationWithEntity = await this.groupsService.findAllWithFilters(pageFilterDto, activeUser);
        paginationWithEntity.data = paginationWithEntity.data.map(entity => this.returnModifiedEntity(entity));

        return paginationWithEntity;
    }

    @Get(':id')
    @Permission(GroupPermissions.Read)
    async findOne(@Param('id') id: string)
    {
        const entity = await this.groupsService.findOne({ id: +id });
        return this.returnModifiedEntity(entity);
    }

    @Put(':id')
    @Permission(GroupPermissions.Update)
    async update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto, @ActiveUser() activeUser: ActiveUserData)
    {
        const entity = await this.groupsService.update(+id, updateGroupDto, activeUser);
        return this.returnModifiedEntity(entity);
    }

    @Delete(':id')
    @Permission(GroupPermissions.Delete)
    async remove(@Param('id') id: string)
    {
        const entity = await this.groupsService.remove(+id);
        return this.returnModifiedEntity(entity);
    }


    private returnModifiedEntity(entity: Group)
    {
        const { employees, leader, organization } = entity;
        entity[ 'employeeGroups' ] = [];

        if (employees)
        {
            entity[ 'employeeGroups' ] = employees.map(item => ({
                employeeId: item.id,
                employeeInfo: {
                    firstName: item.firstName,
                    lastName: item.lastName,
                    middleName: item.lastName,
                    birthDate: item.birthDate,
                    photoUrl: item.photoUrl,
                },
                leader: item.id === leader.id,
            }));
        }

        if (organization)
        {
            Object.assign(entity, {
                organizationId: organization.id,
                organizationName: organization.name,
            });
        }

        return entity;
    }
}
