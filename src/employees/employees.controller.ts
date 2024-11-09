import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EmployeePageFilterDto } from './dto/employee-page-filter.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeesService } from './employees.service';
import { Employee } from './entities/employee.entity';
import { EmployeePermissions } from './enums/employee-permissions.enum';

@ApiTags('employees')
@Controller('employees')
export class EmployeesController
{
    constructor (private readonly employeesService: EmployeesService) { }

    @Post()
    @Permission(EmployeePermissions.Create)
    async create(@Body() createEmployeeDto: CreateEmployeeDto, @ActiveUser() activeUser: ActiveUserData)
    {
        const entity = await this.employeesService.create(createEmployeeDto, activeUser);
        return this.returnModifiedEntity(entity);
    }

    @Get()
    @Permission(EmployeePermissions.Read)
    async findAll(@Query() pageFilterDto: EmployeePageFilterDto, @ActiveUser() activeUser: ActiveUserData)
    {
        const paginationWithEntity = await this.employeesService.findAllWithFilters(pageFilterDto, activeUser);
        paginationWithEntity.data = paginationWithEntity.data.map(entity => this.returnModifiedEntity(entity));

        return paginationWithEntity;
    }

    @Get(':id')
    @Permission(EmployeePermissions.Read)
    async findOne(@Param('id') id: string)
    {
        const entity = await this.employeesService.findOne({ id: +id }, {
            user: {
                organization: true, // BINGO
                roles: true, // BINGO
            }
        });

        return this.returnModifiedEntity(entity);
    }

    @Put(':id')
    @Permission(EmployeePermissions.Update)
    async update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto, @ActiveUser() activeUser: ActiveUserData)
    {
        const entity = await this.employeesService.update(+id, updateEmployeeDto, activeUser);
        return this.returnModifiedEntity(entity);
    }

    @Delete(':id')
    @Permission(EmployeePermissions.Delete)
    async remove(@Param('id') id: string, @ActiveUser() activeUser: ActiveUserData)
    {
        const entity = await this.employeesService.remove(+id, activeUser);
        return this.returnModifiedEntity(entity);
    }

    @Put('password/change/:id')
    @Permission(EmployeePermissions.PasswordChange)
    passwordChange(@Param('id') id: string, @Body() changePasswordDto: ChangePasswordDto)
    {
        return this.employeesService.changePassword(+id, changePasswordDto);
    }

    @Put('profile/update/:id')
    @Permission(EmployeePermissions.ProfileUpdate)
    async profileUpdate(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto, @ActiveUser() activeUser: ActiveUserData)
    {
        const entity = await this.employeesService.update(+id, updateEmployeeDto, activeUser);
        return this.returnModifiedEntity(entity);
    }


    private returnModifiedEntity(entity: Employee) // BINGO
    {
        const { user } = entity;
        const { organization, roles } = user || {};

        if (user)
        {
            delete entity.user.password;

            Object.assign(entity, {
                userId: user.id,
                userName: user.userName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                systemAdmin: user.marks.systemAdmin,
            });
        }

        if (organization)
        {
            Object.assign(entity, {
                organizationId: organization.id,
                organizationName: organization.name,
            });
        }

        if (roles)
        {
            Object.assign(entity, {
                roles,
            });
        }

        return entity;
    }
}
