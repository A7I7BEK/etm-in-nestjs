import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ActionsService } from './actions.service';
import { ActionQueryDto } from './dto/action-query.dto';
import { ActionPermissions } from './enums/action-permissions.enum';


@ApiBearerAuth()
@ApiTags('actions')
@Controller('actions')
export class ActionsController
{
    constructor (private readonly _service: ActionsService) { }


    @Get()
    @Permission(ActionPermissions.READ)
    findAll
        (
            @Query() queryDto: ActionQueryDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.findAllWithFilters(queryDto, activeUser);
    }


    @Get(':id')
    @Permission(ActionPermissions.READ)
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
                    employee: {
                        user: true,
                    },
                    task: true,
                    project: true,
                },
            },
            activeUser,
        );
    }
}
