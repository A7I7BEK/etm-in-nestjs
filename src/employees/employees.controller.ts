import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { EmployeeQueryDto } from './dto/employee-query.dto';
import { EmployeeUserCreateDto } from './dto/employee-user-create.dto';
import { EmployeeUserUpdateDto } from './dto/employee-user-update.dto';
import { EmployeesService } from './employees.service';
import { EmployeePermissions } from './enums/employee-permissions.enum';
import { modifyEntityForFront } from './utils/modify-entity-for-front.util';


@ApiBearerAuth()
@ApiTags('employees')
@Controller('employees')
export class EmployeesController
{
    constructor (private readonly _service: EmployeesService) { }


    @Post()
    @Permission(EmployeePermissions.CREATE)
    async create
        (
            @Body() createDto: EmployeeUserCreateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.create(createDto, activeUser);
        return modifyEntityForFront(entity);
    }


    @Get()
    @Permission(EmployeePermissions.READ)
    async findAll
        (
            @Query() queryDto: EmployeeQueryDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entityWithPagination = await this._service.findAllWithFilters(queryDto, activeUser);
        entityWithPagination.data = entityWithPagination.data.map(entity => modifyEntityForFront(entity));

        return entityWithPagination;
    }


    @Get(':id')
    @Permission(EmployeePermissions.READ)
    async findOne
        (
            @Param('id', ParseIntPipe) id: number,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.findOne(
            {
                where: { id },
                relations: {
                    user: {
                        organization: true,
                        roles: true,
                    }
                }
            },
            activeUser,
        );
        return modifyEntityForFront(entity);
    }


    @Put(':id')
    @Permission(EmployeePermissions.UPDATE)
    async update
        (
            @Param('id', ParseIntPipe) id: number,
            @Body() updateDto: EmployeeUserUpdateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.update(id, updateDto, activeUser);
        return modifyEntityForFront(entity);
    }


    @Delete(':id')
    @Permission(EmployeePermissions.DELETE)
    async remove
        (
            @Param('id', ParseIntPipe) id: number,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.remove(id, activeUser);
        return modifyEntityForFront(entity);
    }
}
