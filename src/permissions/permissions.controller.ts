import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { PermissionQueryDto } from './dto/permission-query.dto';
import { PermissionPermissions } from './enums/permission-permissions.enum';
import { PermissionsService } from './permissions.service';


@ApiBearerAuth()
@ApiTags('permissions')
@Controller('permissions')
export class PermissionsController
{
    constructor (private readonly _service: PermissionsService) { }


    @Get()
    @Permission(PermissionPermissions.READ)
    findAll
        (
            @Query() queryDto: PermissionQueryDto,
        )
    {
        return this._service.findAllWithFilters(queryDto);
    }


    @Get(':id')
    @Permission(PermissionPermissions.READ)
    findOne
        (
            @Param('id', ParseIntPipe) id: number,
        )
    {
        return this._service.findOne({ where: { id } });
    }
}
