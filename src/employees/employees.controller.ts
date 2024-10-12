import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeesService } from './employees.service';
import { EmployeesPermission } from './enums/employees-permission.enum';

@ApiTags('employees')
@Controller('employees')
export class EmployeesController
{
    constructor (private readonly employeesService: EmployeesService) { }

    @Post()
    @Permission(EmployeesPermission.Create)
    create(@Body() createEmployeeDto: CreateEmployeeDto, @ActiveUser() activeUser: ActiveUserData)
    {
        return this.employeesService.create(createEmployeeDto, activeUser);
    }

    @Get()
    @Permission(EmployeesPermission.Read)
    findAll()
    {
        return this.employeesService.findAll();
    }

    @Get(':id')
    @Permission(EmployeesPermission.Read)
    async findOne(@Param('id') id: string)
    {
        const { user, ...employee } = await this.employeesService.findOne(+id, {
            user: {
                organization: true, // BINGO
                roles: true, // BINGO
            }
        });

        // BINGO
        const entity = {
            ...employee,
            ...{
                userId: user.id,
                userName: user.userName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                organizationId: user.organization.id,
                systemAdmin: user.marks.systemAdmin,
                roles: user.roles,
            }
        };

        return entity;
    }

    @Put(':id')
    @Permission(EmployeesPermission.Update)
    update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto, @ActiveUser() activeUser: ActiveUserData)
    {
        return this.employeesService.update(+id, updateEmployeeDto, activeUser);
    }

    @Delete(':id')
    @Permission(EmployeesPermission.Delete)
    remove(@Param('id') id: string)
    {
        return this.employeesService.remove(+id);
    }

    @Put('password/change/:id')
    @Permission(EmployeesPermission.PasswordChange)
    passwordChange(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto)
    {
        return '';
        // return this.employeesService.update(+id, updateEmployeeDto);
    }

    @Put('profile/update/:id')
    @Permission(EmployeesPermission.ProfileUpdate)
    profileUpdate(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto)
    {
        return '';
        // return this.employeesService.update(+id, updateEmployeeDto);
    }
}
