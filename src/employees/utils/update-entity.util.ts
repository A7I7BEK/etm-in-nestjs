import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { UserCheckUniqueValueDto } from 'src/users/dto/user-check-unique-value.dto';
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


    if (dto.photoFileId)
    {
        const resourceEntity = await service.resourceService.findOne(
            {
                where: { id: dto.photoFileId }
            },
            activeUser,
        );

        if (entity.photoFile && entity.photoFile.id !== dto.photoFileId)
        {
            await service.resourceService.removeSelf(entity.photoFile);
        }

        entity.photoFile = resourceEntity;
    }
    else if (entity.photoFile) // dto.photoFileId === 0 && entity.photoFile exists
    {
        await service.resourceService.removeSelf(entity.photoFile);
    }


    entity.user.userName = dto.user.userName;
    entity.user.email = dto.user.email;
    entity.user.phoneNumber = dto.user.phoneNumber;
    await service.usersService.repository.save(entity.user);


    entity.firstName = dto.firstName;
    entity.lastName = dto.lastName;
    entity.middleName = dto.middleName;
    entity.birthDate = dto.birthDate;
    await service.repository.save(entity);


    if (dto.photoFileId)
    {
        await service.resourceTrackerService.setAll(entity);
    }


    return entity;
}
