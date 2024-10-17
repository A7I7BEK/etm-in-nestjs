import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './entities/group.entity';
import { GroupsPermission } from './enums/groups-permission.enum';
import { GroupsService } from './groups.service';

@ApiTags('groups')
@Controller('groups')
export class GroupsController
{
    constructor (private readonly groupsService: GroupsService) { }

    @Post()
    @Permission(GroupsPermission.Create)
    async create(@Body() createGroupDto: CreateGroupDto, @ActiveUser() activeUser: ActiveUserData)
    {
        const entity = await this.groupsService.create(createGroupDto, activeUser);
        return this.returnModifiedEntity(entity);
    }

    @Get()
    @Permission(GroupsPermission.Read)
    findAll()
    {
        return this.groupsService.findAll();
    }

    @Get(':id')
    @Permission(GroupsPermission.Read)
    async findOne(@Param('id') id: string)
    {
        const entity = await this.groupsService.findOne({ id: +id });
        return this.returnModifiedEntity(entity);
    }

    @Put(':id')
    @Permission(GroupsPermission.Update)
    async update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto, @ActiveUser() activeUser: ActiveUserData)
    {
        const entity = await this.groupsService.update(+id, updateGroupDto, activeUser);
        return this.returnModifiedEntity(entity);
    }

    @Delete(':id')
    @Permission(GroupsPermission.Delete)
    async remove(@Param('id') id: string)
    {
        const entity = await this.groupsService.remove(+id);
        return this.returnModifiedEntity(entity);
    }


    private returnModifiedEntity(entity: Group)
    {
        const { organization, leader, employees, ...entityRest } = entity;

        let employeeGroups;
        if (employees)
        {
            employeeGroups = employees.map(item =>
            {
                return {
                    employeeId: item.id,
                    employeeInfo: {
                        firstName: item.firstName,
                        lastName: item.lastName,
                        middleName: item.lastName,
                        birthDate: item.birthDate,
                        photoUrl: item.photoUrl,
                    },
                    leader: item.id === leader.id,
                };
            });
        }

        const entityNew = {
            ...entityRest,
            ...{
                organizationId: organization.id,
                organizationName: organization.name,
                employeeGroups,
            },
        };

        return entityNew;
    }
}
