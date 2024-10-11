import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
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
    create(@Body() createEmployeeDto: CreateEmployeeDto)
    {
        return this.employeesService.create(createEmployeeDto);
    }

    @Get()
    @Permission(EmployeesPermission.Read)
    findAll()
    {
        return this.employeesService.findAll();
    }

    @Get(':id')
    @Permission(EmployeesPermission.Read)
    findOne(@Param('id') id: string)
    {
        return this.employeesService.findOne(+id);
    }

    @Put(':id')
    @Permission(EmployeesPermission.Update)
    update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto)
    {
        return this.employeesService.update(+id, updateEmployeeDto);
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
        return this.employeesService.update(+id, updateEmployeeDto);
    }

    @Put('profile/update/:id')
    @Permission(EmployeesPermission.ProfileUpdate)
    profileUpdate(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto)
    {
        return this.employeesService.update(+id, updateEmployeeDto);
    }
}
