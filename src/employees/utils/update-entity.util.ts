import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { UserCheckUniqueValueDto } from 'src/users/dto/user-check-unique-value.dto';
import { Equal } from 'typeorm';
import { EmployeeUserUpdateDto } from '../dto/employee-user-update.dto';
import { EmployeesService } from '../employees.service';


export async function updateEntityUtil
    (
        service: EmployeesService,
        id: number,
        dto: EmployeeUserUpdateDto,
        activeUser: ActiveUserData,
    )
{
    const entity = await service.findOne(
        {
            where: { id },
            relations: { user: true },
        },
        activeUser,
    );


    const uniqueVal: UserCheckUniqueValueDto = {
        userName: entity.user.userName === dto.user.userName ? null : dto.user.userName,
        email: entity.user.email === dto.user.email ? null : dto.user.email,
        phoneNumber: entity.user.phoneNumber === dto.user.phoneNumber ? null : dto.user.phoneNumber,
    };
    if (uniqueVal.userName || uniqueVal.email || uniqueVal.phoneNumber)
    {
        await service.usersService.checkUniqueValue(uniqueVal);
    }


    entity.user.organization = await service.organizationsService.findOneActiveUser(
        {
            where: { id: dto.user.organizationId }
        },
        activeUser,
    );


    if (dto.resourceFile?.id)
    {
        const oldPhoto = entity.photoUrl;


        entity.photoUrl = (await service.resourceService.findOne(
            {
                where: { id: dto.resourceFile.id }
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


    entity.user.userName = dto.user.userName;
    entity.user.email = dto.user.email;
    entity.user.phoneNumber = dto.user.phoneNumber;
    await service.usersService.repository.save(entity.user);


    entity.firstName = dto.firstName;
    entity.lastName = dto.lastName;
    entity.middleName = dto.middleName;
    entity.birthDate = dto.birthDate;
    return service.repository.save(entity);
}
