import { ConflictException } from '@nestjs/common';
import { HashingService } from 'src/iam/hashing/hashing.service';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { ResourceService } from 'src/resource/resource.service';
import { User } from 'src/users/entities/user.entity';
import { USER_MARK_EMPLOYEE_NEW } from 'src/users/marks/user-mark.constants';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { EmployeeCreateDto } from '../dto/employee-create.dto';
import { EmployeeUpdateDto } from '../dto/employee-update.dto';
import { Employee } from '../entities/employee.entity';


export async function createUpdateEntity
    (
        organizationsService: OrganizationsService,
        resourceService: ResourceService,
        usersService: UsersService,
        hashingService: HashingService,
        repository: Repository<Employee>,
        dto: EmployeeCreateDto | EmployeeUpdateDto,
        activeUser: ActiveUserData,
        userEntity = new User(),
        employeeEntity = new Employee(),
    )
{
    const usersFound = await usersService.repository.find({
        where: [ // BINGO
            { userName: dto.user.userName },
            { email: dto.user.email },
            { phoneNumber: dto.user.phoneNumber },
        ]
    });

    if (usersFound && usersFound.find(x => x.userName === dto.user.userName))
    {
        throw new ConflictException('Username already exists');
    }

    if (usersFound && usersFound.find(x => x.email === dto.user.email))
    {
        throw new ConflictException('Email already exists');
    }

    if (usersFound && usersFound.find(x => x.phoneNumber === dto.user.phoneNumber))
    {
        throw new ConflictException('Phone number already exists');
    }


    const organizationEntity = await organizationsService.findOneActiveUser(
        {
            where: { id: dto.user.organizationId }
        },
        activeUser,
    );

    if (dto instanceof EmployeeCreateDto)
    {
        userEntity.password = await hashingService.hash(dto.user.password);
    }

    if (dto.resourceFile?.id)
    {
        employeeEntity.photoUrl = (await resourceService.findOne({ id: dto.resourceFile?.id })).url;
    }


    userEntity.userName = dto.user.userName;
    userEntity.email = dto.user.email;
    userEntity.phoneNumber = dto.user.phoneNumber;
    userEntity.marks = USER_MARK_EMPLOYEE_NEW;
    userEntity.organization = organizationEntity;
    await usersService.repository.save(userEntity);

    employeeEntity.firstName = dto.firstName;
    employeeEntity.lastName = dto.lastName;
    employeeEntity.middleName = dto.middleName;
    employeeEntity.birthDate = dto.birthDate;
    employeeEntity.user = userEntity;
    return repository.save(employeeEntity);
}
