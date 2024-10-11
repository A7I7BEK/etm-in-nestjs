import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingService } from 'src/iam/hashing/hashing.service';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { Organization } from 'src/organizations/entities/organization.entity';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { ResourceService } from 'src/resource/resource.service';
import { User } from 'src/users/entities/user.entity';
import { USER_MARK_EMPLOYEE_NEW } from 'src/users/marks/user-mark.constants';
import { Repository } from 'typeorm';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';

@Injectable()
export class EmployeesService
{
    constructor (
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @InjectRepository(Employee)
        private readonly employeesRepository: Repository<Employee>,
        private readonly organizationsService: OrganizationsService,
        private readonly resourceService: ResourceService,
        private readonly hashingService: HashingService,
    ) { }

    async create(createEmployeeDto: CreateEmployeeDto, activeUser: ActiveUserData)
    {
        const usernameExists = await this.usersRepository.existsBy({ userName: createEmployeeDto.user.userName });
        if (usernameExists)
        {
            throw new ConflictException('Username already exists');
        }

        const emailExists = await this.usersRepository.existsBy({ email: createEmployeeDto.user.email });
        if (emailExists)
        {
            throw new ConflictException('Email already exists');
        }

        const phoneNumberExists = await this.usersRepository.existsBy({ phoneNumber: createEmployeeDto.user.phoneNumber });
        if (phoneNumberExists)
        {
            throw new ConflictException('Phone number already exists');
        }


        let organizationEntity: Organization;
        if (createEmployeeDto.user.organizationId)
        {
            organizationEntity = await this.organizationsService.findOne(createEmployeeDto.user.organizationId);
        }
        else
        {
            const activeUserEntity = await this.usersRepository.findOne({
                where: {
                    id: activeUser.sub
                },
                relations: {
                    organization: true
                },
            });

            if (!activeUserEntity)
            {
                throw new NotFoundException();
            }

            organizationEntity = activeUserEntity.organization;
        }

        const userEntity = new User();
        userEntity.userName = createEmployeeDto.user.userName;
        userEntity.password = await this.hashingService.hash(createEmployeeDto.user.password);
        userEntity.email = createEmployeeDto.user.email;
        userEntity.phoneNumber = createEmployeeDto.user.phoneNumber;
        userEntity.marks = USER_MARK_EMPLOYEE_NEW;
        userEntity.organization = organizationEntity;
        await this.usersRepository.save(userEntity);

        const employeeEntity = new Employee();
        employeeEntity.firstName = createEmployeeDto.firstName;
        employeeEntity.lastName = createEmployeeDto.lastName;
        employeeEntity.middleName = createEmployeeDto.middleName;
        employeeEntity.birthDate = createEmployeeDto.birthDate;
        employeeEntity.photoUrl = (await this.resourceService.findOne(createEmployeeDto.resourceFile.id)).url;
        employeeEntity.user = userEntity;
        return this.employeesRepository.save(employeeEntity);
    }

    findAll()
    {
        return this.employeesRepository.find();
    }

    async findOne(id: number)
    {
        const entity = await this.employeesRepository.findOneBy({ id });

        if (!entity)
        {
            throw new NotFoundException();
        }

        return entity;
    }

    async update(id: number, updateEmployeeDto: UpdateEmployeeDto)
    {
        const entity = await this.findOne(id);

        Object.assign(entity, updateEmployeeDto);

        return this.employeesRepository.save(entity);
    }

    async remove(id: number)
    {
        const entity = await this.findOne(id);
        return this.employeesRepository.remove(entity);
    }
}
