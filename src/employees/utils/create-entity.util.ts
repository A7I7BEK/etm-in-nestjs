import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { User } from 'src/users/entities/user.entity';
import { USER_MARK_EMPLOYEE_NEW } from 'src/users/marks/user-mark.constants';
import { EmployeeUserCreateDto } from '../dto/employee-user-create.dto';
import { EmployeesService } from '../employees.service';
import { Employee } from '../entities/employee.entity';


export async function createEntityUtil
    (
        service: EmployeesService,
        dto: EmployeeUserCreateDto,
        activeUser: ActiveUserData,
    )
{
    await service.usersService.checkUniqueValue({
        userName: dto.user.userName,
        email: dto.user.email,
        phoneNumber: dto.user.phoneNumber,
    });


    const userEntity = new User();
    const employeeEntity = new Employee();


    userEntity.organization = await service.organizationsService.findOneActiveUser(
        {
            where: { id: dto.user.organizationId }
        },
        activeUser,
    );


    if (dto.resourceFile?.id)
    {
        employeeEntity.photoUrl = (await service.resourceService.findOne(
            {
                where: { id: dto.resourceFile.id }
            },
            activeUser,
        )).url;
    }


    userEntity.userName = dto.user.userName;
    userEntity.password = await service.hashingService.hash(dto.user.password);
    userEntity.email = dto.user.email;
    userEntity.phoneNumber = dto.user.phoneNumber;
    userEntity.marks = USER_MARK_EMPLOYEE_NEW;
    await service.usersService.repository.save(userEntity);


    employeeEntity.firstName = dto.firstName;
    employeeEntity.lastName = dto.lastName;
    employeeEntity.middleName = dto.middleName;
    employeeEntity.birthDate = dto.birthDate;
    employeeEntity.user = userEntity;
    return service.repository.save(employeeEntity);
}
