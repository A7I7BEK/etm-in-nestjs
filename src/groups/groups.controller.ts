import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupsPermission } from './enums/groups-permission.enum';
import { GroupsService } from './groups.service';

@ApiTags('groups')
@Controller('groups')
export class GroupsController
{
    constructor (private readonly groupsService: GroupsService) { }

    @Post()
    @Permission(GroupsPermission.Create)
    create(@Body() createGroupDto: CreateGroupDto, @ActiveUser() activeUser: ActiveUserData)
    {
        return this.groupsService.create(createGroupDto);
    }

    @Get()
    @Permission(GroupsPermission.Read)
    findAll()
    {
        return this.groupsService.findAll();
    }

    @Get(':id')
    @Permission(GroupsPermission.Read)
    findOne(@Param('id') id: string)
    {
        return this.groupsService.findOne(+id);
    }

    @Put(':id')
    @Permission(GroupsPermission.Update)
    update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto, @ActiveUser() activeUser: ActiveUserData)
    {
        return this.groupsService.update(+id, updateGroupDto);
    }

    @Delete(':id')
    @Permission(GroupsPermission.Delete)
    remove(@Param('id') id: string)
    {
        return this.groupsService.remove(+id);
    }
}
