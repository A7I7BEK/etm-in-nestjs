import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { GroupCreateDto } from './dto/group-create.dto';
import { GroupQueryDto } from './dto/group-query.dto';
import { GroupUpdateDto } from './dto/group-update.dto';
import { GroupPermissions } from './enums/group-permissions.enum';
import { GroupsService } from './groups.service';


@ApiBearerAuth()
@ApiTags('groups')
@Controller('groups')
export class GroupsController
{
    constructor (private readonly _service: GroupsService) { }


    @Post()
    @Permission(GroupPermissions.CREATE)
    create
        (
            @Body() createDto: GroupCreateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.create(createDto, activeUser);
    }


    @Get()
    @Permission(GroupPermissions.READ)
    findAll
        (
            @Query() queryDto: GroupQueryDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.findAllWithFilters(queryDto, activeUser);
    }


    @Get(':id')
    @Permission(GroupPermissions.READ)
    findOne
        (
            @Param('id', ParseIntPipe) id: number,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.findOne(
            {
                where: { id },
                relations: {
                    employees: {
                        user: true,
                    },
                    leader: {
                        user: true,
                    },
                    organization: true,
                }
            },
            activeUser,
        );
    }


    @Put(':id')
    @Permission(GroupPermissions.UPDATE)
    update
        (
            @Param('id', ParseIntPipe) id: number,
            @Body() updateDto: GroupUpdateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.update(id, updateDto, activeUser);
    }


    @Delete(':id')
    @Permission(GroupPermissions.DELETE)
    remove
        (
            @Param('id', ParseIntPipe) id: number,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.remove(id, activeUser);
    }
}
