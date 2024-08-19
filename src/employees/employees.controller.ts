import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permissions } from 'src/iam/authorization/decorators/permissions.decorator';
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
    @Permissions(EmployeesPermission.EmployeeCreate)
    create(@Body() createEmployeeDto: CreateEmployeeDto)
    {
        return this.employeesService.create(createEmployeeDto);
    }

    @Get()
    @Permissions(EmployeesPermission.EmployeeRead)
    findAll()
    {
        return this.employeesService.findAll();
    }

    @Get(':id')
    @Permissions(EmployeesPermission.EmployeeRead)
    findOne(@Param('id') id: string)
    {
        return this.employeesService.findOne(+id);
    }

    @Put(':id')
    @Permissions(EmployeesPermission.EmployeeUpdate)
    update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto)
    {
        return this.employeesService.update(+id, updateEmployeeDto);
    }

    @Delete(':id')
    @Permissions(EmployeesPermission.EmployeeDelete)
    remove(@Param('id') id: string)
    {
        return this.employeesService.remove(+id);
    }
}
