import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { EmployeeChangePasswordDto } from '../dto/employee-change-password.dto';
import { EmployeesService } from '../employees.service';


export async function changePasswordUtil
    (
        service: EmployeesService,
        dto: EmployeeChangePasswordDto,
        activeUser: ActiveUserData,
    )
{
    const entity = await service.findOne(
        {
            where: { id: dto.employeeId },
            relations: { user: true },
        },
        activeUser,
    );


    entity.user.password = await service.hashingService.hash(dto.password);


    return service.usersService.repository.save(entity.user);
}
