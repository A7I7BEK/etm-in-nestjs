import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import appConfig from 'src/common/config/app.config';
import { HashingService } from 'src/iam/hashing/hashing.service';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { Organization } from 'src/organizations/entities/organization.entity';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { Resource } from 'src/resource/entities/resource.entity';
import { ResourceService } from 'src/resource/resource.service';
import { User } from 'src/users/entities/user.entity';
import { USER_MARK_EMPLOYEE_NEW } from 'src/users/marks/user-mark.constants';
import { UsersService } from 'src/users/users.service';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
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
        private readonly usersService: UsersService,
        private readonly hashingService: HashingService,
    ) { }

    // BINGO
    private async manageEntity(
        dto: CreateEmployeeDto | UpdateEmployeeDto,
        activeUser: ActiveUserData,
        userEntity = new User(),
        employeeEntity = new Employee(),
    )
    {
        const usernameExists = await this.usersRepository.existsBy({ userName: dto.user.userName });
        if (usernameExists)
        {
            throw new ConflictException('Username already exists');
        }

        const emailExists = await this.usersRepository.existsBy({ email: dto.user.email });
        if (emailExists)
        {
            throw new ConflictException('Email already exists');
        }

        const phoneNumberExists = await this.usersRepository.existsBy({ phoneNumber: dto.user.phoneNumber });
        if (phoneNumberExists)
        {
            throw new ConflictException('Phone number already exists');
        }


        let organizationEntity: Organization;
        if (dto.user.organizationId)
        {
            organizationEntity = await this.organizationsService.findOne({ id: dto.user.organizationId });
        }
        else
        {
            const activeUserEntity = await this.usersService.findOne(
                { id: activeUser.sub },
                { organization: true },
            );

            organizationEntity = activeUserEntity.organization;
        }

        let passwordHash: string;
        if (dto instanceof CreateEmployeeDto && dto.user.password)
        {
            passwordHash = await this.hashingService.hash(dto.user.password);
        }

        let resourceEntity: Resource;
        if (dto.resourceFile?.id)
        {
            resourceEntity = await this.resourceService.findOne({ id: dto.resourceFile.id });
        }


        userEntity.userName = dto.user.userName;
        userEntity.password = passwordHash ? passwordHash : undefined;
        userEntity.email = dto.user.email;
        userEntity.phoneNumber = dto.user.phoneNumber;
        userEntity.marks = USER_MARK_EMPLOYEE_NEW;
        userEntity.organization = organizationEntity;
        await this.usersRepository.save(userEntity);

        employeeEntity.firstName = dto.firstName;
        employeeEntity.lastName = dto.lastName;
        employeeEntity.middleName = dto.middleName;
        employeeEntity.birthDate = dto.birthDate;
        employeeEntity.photoUrl = resourceEntity ? resourceEntity.url : undefined;
        employeeEntity.user = userEntity;
        return this.employeesRepository.save(employeeEntity);
    }

    create(createEmployeeDto: CreateEmployeeDto, activeUser: ActiveUserData)
    {
        return this.manageEntity(createEmployeeDto, activeUser);
    }

    findAll()
    {
        return this.employeesRepository.find();
    }

    async findOne(where: FindOptionsWhere<Employee>, relations?: FindOptionsRelations<Employee>) // BINGO
    {
        const entity = await this.employeesRepository.findOne({ where, relations });

        if (!entity || entity.firstName === appConfig().admin.firstName) // Don't show system admin
        {
            throw new NotFoundException(`${Employee.name} not found`); // BINGO
        }

        return entity;
    }

    async update(id: number, updateEmployeeDto: UpdateEmployeeDto, activeUser: ActiveUserData)
    {
        const entity = await this.findOne({ id }, { user: true });
        return this.manageEntity(updateEmployeeDto, activeUser, entity.user, entity);
    }

    async remove(id: number)
    {
        const entity = await this.findOne({ id });
        return this.employeesRepository.remove(entity);
    }
}
