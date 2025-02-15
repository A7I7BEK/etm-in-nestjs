import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { EmployeeChangePasswordDto } from './dto/employee-change-password.dto';
import { EmployeeCreateDto } from './dto/employee-create.dto';
import { EmployeeQueryDto } from './dto/employee-query.dto';
import { EmployeeUpdateDto } from './dto/employee-update.dto';
import { EmployeesService } from './employees.service';
import { EmployeePermissions } from './enums/employee-permissions.enum';
import { modifyEntityForFront } from './utils/modify-entity-for-front.util';

@ApiTags('employees')
@Controller('employees')
export class EmployeesController
{
    constructor (private readonly _service: EmployeesService) { }


    @Post()
    @Permission(EmployeePermissions.Create)
    async create
        (
            @Body() createDto: EmployeeCreateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.create(createDto, activeUser);
        return modifyEntityForFront(entity);
    }


    @Get()
    @Permission(EmployeePermissions.Read)
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
    @Permission(EmployeePermissions.Read)
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
    @Permission(EmployeePermissions.Update)
    async update
        (
            @Param('id', ParseIntPipe) id: number,
            @Body() updateDto: EmployeeUpdateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.update(id, updateDto, activeUser);
        return modifyEntityForFront(entity);
    }


    @Delete(':id')
    @Permission(EmployeePermissions.Delete)
    async remove
        (
            @Param('id', ParseIntPipe) id: number,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.remove(id, activeUser);
        return modifyEntityForFront(entity);
    }


    @Put('change-password/:id')
    @Permission(EmployeePermissions.PasswordChange)
    async passwordChange
        (
            @Param('id', ParseIntPipe) id: number,
            @Body() changePasswordDto: EmployeeChangePasswordDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.changePassword(id, changePasswordDto, activeUser);
    }


    @Put('update-profile/:id') // TODO: may not be needed, as it is already in the update method
    @Permission(EmployeePermissions.ProfileUpdate)
    async profileUpdate
        (
            @Param('id', ParseIntPipe) id: number,
            @Body() updateDto: EmployeeUpdateDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        const entity = await this._service.update(id, updateDto, activeUser);
        return modifyEntityForFront(entity);
    }
}
