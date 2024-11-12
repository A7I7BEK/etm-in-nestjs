import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderReverse } from 'src/common/pagination/order.enum';
import { PaginationMeta } from 'src/common/pagination/pagination-meta.class';
import { Pagination } from 'src/common/pagination/pagination.class';
import { HashingService } from 'src/iam/hashing/hashing.service';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { Organization } from 'src/organizations/entities/organization.entity';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { Resource } from 'src/resource/entities/resource.entity';
import { ResourceService } from 'src/resource/resource.service';
import { User } from 'src/users/entities/user.entity';
import { USER_MARK_EMPLOYEE_NEW } from 'src/users/marks/user-mark.constants';
import { UsersService } from 'src/users/users.service';
import { Brackets, FindManyOptions, FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EmployeePageFilterDto } from './dto/employee-page-filter.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';
import { EmployeeProperties } from './enums/employee-properties.enum';

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
        let usersFound: User[];
        if (dto.user?.userName || dto.user?.email || dto.user?.phoneNumber)
        {
            usersFound = await this.usersRepository.find({
                where: [ // BINGO
                    { userName: dto.user?.userName },
                    { email: dto.user?.email },
                    { phoneNumber: dto.user?.phoneNumber },
                ]
            });
        }


        if (usersFound && usersFound.find(x => x.userName === dto.user?.userName))
        {
            throw new ConflictException('Username already exists');
        }

        if (usersFound && usersFound.find(x => x.email === dto.user?.email))
        {
            throw new ConflictException('Email already exists');
        }

        if (usersFound && usersFound.find(x => x.phoneNumber === dto.user?.phoneNumber))
        {
            throw new ConflictException('Phone number already exists');
        }


        let organizationEntity: Organization;
        if (dto.user?.organizationId)
        {
            organizationEntity = await this.organizationsService.findOne({ id: dto.user?.organizationId });
        }
        else
        {
            organizationEntity = await this.organizationsService.findOne({ id: activeUser.orgId });
        }

        let passwordHash: string;
        if (dto instanceof CreateEmployeeDto && dto.user?.password)
        {
            passwordHash = await this.hashingService.hash(dto.user?.password);
        }

        let resourceEntity: Resource;
        if (dto.resourceFile?.id)
        {
            resourceEntity = await this.resourceService.findOne({ id: dto.resourceFile?.id });
        }


        userEntity.userName = dto.user?.userName;
        userEntity.password = passwordHash ? passwordHash : undefined;
        userEntity.email = dto.user?.email;
        userEntity.phoneNumber = dto.user?.phoneNumber;
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

    findAll(options?: FindManyOptions<Employee>)
    {
        return this.employeesRepository.find(options);
    }

    async findAllWithFilters(pageFilterDto: EmployeePageFilterDto, activeUser: ActiveUserData)
    {
        const [ empl, user, org, role ] = [ 'employee', 'user', 'organization', 'role' ];
        // BINGO
        const sortBy = (<any>Object)
            .values(EmployeeProperties)
            .includes(pageFilterDto.sortBy)
            ? empl + '.' + pageFilterDto.sortBy
            : user + '.' + pageFilterDto.sortBy;


        const queryBuilder = this.employeesRepository.createQueryBuilder(empl);
        queryBuilder.leftJoinAndSelect(`${empl}.user`, user);
        queryBuilder.leftJoinAndSelect(`${user}.organization`, org);
        queryBuilder.leftJoinAndSelect(`${user}.roles`, role);
        queryBuilder.skip(pageFilterDto.skip);
        queryBuilder.take(pageFilterDto.perPage);
        queryBuilder.orderBy(sortBy, OrderReverse[ pageFilterDto.sortDirection ]);

        if (pageFilterDto.organizationId)
        {
            queryBuilder.andWhere(`${user}.organization = :orgId`, { orgId: pageFilterDto.organizationId });
        }
        else
        {
            queryBuilder.andWhere(`${user}.organization = :orgId`, { orgId: activeUser.orgId });
        }

        if (pageFilterDto.allSearch)
        {
            queryBuilder.andWhere(
                new Brackets((qb) =>
                {
                    qb.orWhere(`${empl}.firstName ILIKE :search`, { search: `%${pageFilterDto.allSearch}%` });
                    qb.orWhere(`${empl}.lastName ILIKE :search`, { search: `%${pageFilterDto.allSearch}%` });
                    qb.orWhere(`${empl}.middleName ILIKE :search`, { search: `%${pageFilterDto.allSearch}%` });
                    qb.orWhere(`${user}.userName ILIKE :search`, { search: `%${pageFilterDto.allSearch}%` });
                    qb.orWhere(`${user}.email ILIKE :search`, { search: `%${pageFilterDto.allSearch}%` });
                    qb.orWhere(`${role}.roleName ILIKE :search`, { search: `%${pageFilterDto.allSearch}%` });
                    qb.orWhere(`${role}.codeName ILIKE :search`, { search: `%${pageFilterDto.allSearch}%` });
                }),
            );
        }

        const [ data, total ] = await queryBuilder.getManyAndCount();

        const paginationMeta = new PaginationMeta(pageFilterDto.page, pageFilterDto.perPage, total);

        return new Pagination<Employee>(data, paginationMeta);
    }

    async findOne(where: FindOptionsWhere<Employee>, relations?: FindOptionsRelations<Employee>) // BINGO
    {
        const entity = await this.employeesRepository.findOne({ where, relations });

        if (!entity)
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

    async remove(id: number, activeUser: ActiveUserData)
    {
        const entity = await this.findOne({ id }, { user: true });

        if (entity.user.id === activeUser.sub)
        {
            throw new ForbiddenException('Cannot delete yourself');
        }

        const entityRemoved = await this.employeesRepository.remove(entity);
        await this.usersService.remove(entity.user.id);

        return entityRemoved;
    }

    async changePassword(id: number, changePasswordDto: ChangePasswordDto)
    {
        const entity = await this.findOne({ id }, { user: true });

        entity.user.password = await this.hashingService.hash(changePasswordDto.newPassword);
        await this.usersRepository.save(entity.user);
    }
}
