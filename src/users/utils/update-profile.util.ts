import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { Equal } from 'typeorm';
import { UserCheckUniqueValueDto } from '../dto/user-check-unique-value.dto';
import { UserEmployeeUpdateDto } from '../dto/user-employee-update.dto';
import { UsersService } from '../users.service';


export async function updateProfileUtil
    (
        service: UsersService,
        dto: UserEmployeeUpdateDto,
        activeUser: ActiveUserData,
    )
{
    const entity = await service.findOne(
        {
            where: { id: activeUser.sub },
            relations: { employee: true },
        },
        activeUser,
    );


    const uniqueVal: UserCheckUniqueValueDto = {
        userName: entity.userName === dto.userName ? null : dto.userName,
        email: entity.email === dto.email ? null : dto.email,
        phoneNumber: entity.phoneNumber === dto.phoneNumber ? null : dto.phoneNumber,
    };
    if (uniqueVal.userName || uniqueVal.email || uniqueVal.phoneNumber)
    {
        await service.checkUniqueValue(uniqueVal);
    }


    if (dto.employee.resourceFile?.id)
    {
        const oldPhoto = entity.employee.photoUrl;


        entity.employee.photoUrl = (await service.resourceService.findOne(
            {
                where: { id: dto.employee.resourceFile.id }
            },
            activeUser,
        )).url;


        const file = await service.resourceService.repository.findOneBy({
            url: Equal(oldPhoto)
        });
        if (file)
        {
            await service.resourceService.remove(file.id, activeUser);
        }
    }


    entity.employee.firstName = dto.employee.firstName;
    entity.employee.lastName = dto.employee.lastName;
    entity.employee.middleName = dto.employee.middleName;
    entity.employee.birthDate = dto.employee.birthDate;
    await service.employeesService.repository.save(entity.employee);


    entity.userName = dto.userName;
    entity.email = dto.email;
    entity.phoneNumber = dto.phoneNumber;
    return service.repository.save(entity);
}
