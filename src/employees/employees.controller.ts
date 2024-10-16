import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/iam/authorization/decorators/permission.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeesService } from './employees.service';
import { Employee } from './entities/employee.entity';
import { EmployeesPermission } from './enums/employees-permission.enum';

@ApiTags('employees')
@Controller('employees')
export class EmployeesController
{
    constructor (private readonly employeesService: EmployeesService) { }

    @Post()
    @Permission(EmployeesPermission.Create)
    async create(@Body() createEmployeeDto: CreateEmployeeDto, @ActiveUser() activeUser: ActiveUserData)
    {
        const entity = await this.employeesService.create(createEmployeeDto, activeUser);
        return this.returnModifiedEntity(entity, true, true);
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
        const entity = await this.employeesService.findOne(
            { id: +id },
            {
                user: {
                    organization: true, // BINGO
                    roles: true, // BINGO
                }
            }
        );

        return this.returnModifiedEntity(entity, true, true, true);
    }

    @Put(':id')
    @Permission(EmployeesPermission.Update)
    async update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto, @ActiveUser() activeUser: ActiveUserData)
    {
        const entity = await this.employeesService.update(+id, updateEmployeeDto, activeUser);
        return this.returnModifiedEntity(entity, true, true);
    }

    @Delete(':id')
    @Permission(EmployeesPermission.Delete)
    async remove(@Param('id') id: string, @ActiveUser() activeUser: ActiveUserData)
    {
        const entity = await this.employeesService.remove(+id, activeUser);
        return this.returnModifiedEntity(entity, true);
    }

    @Put('password/change/:id')
    @Permission(EmployeesPermission.PasswordChange)
    passwordChange(@Param('id') id: string, @Body() changePasswordDto: ChangePasswordDto)
    {
        return this.employeesService.changePassword(+id, changePasswordDto);
    }

    @Put('profile/update/:id')
    @Permission(EmployeesPermission.ProfileUpdate)
    async profileUpdate(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto, @ActiveUser() activeUser: ActiveUserData)
    {
        const entity = await this.employeesService.update(+id, updateEmployeeDto, activeUser);
        return this.returnModifiedEntity(entity, true, true);
    }


    private returnModifiedEntity(entity: Employee, user?: boolean, organization?: boolean, roles?: boolean) // BINGO
    {
        const { user: employeeUser, ...entityRest } = entity;
        const entityNew = { ...entityRest };

        if (user)
        {
            Object.assign(entityNew, {
                userId: employeeUser.id,
                userName: employeeUser.userName,
                email: employeeUser.email,
                phoneNumber: employeeUser.phoneNumber,
                systemAdmin: employeeUser.marks.systemAdmin,
            });
        }

        if (organization)
        {
            Object.assign(entityNew, {
                organizationId: employeeUser.organization.id,
                organizationName: employeeUser.organization.name,
            });
        }

        if (roles)
        {
            Object.assign(entityNew, {
                roles: employeeUser.roles,
            });
        }

        return entityNew;
    }
}
