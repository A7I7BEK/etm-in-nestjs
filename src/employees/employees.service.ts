import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationMeta } from 'src/common/pagination/pagination-meta.class';
import { Pagination } from 'src/common/pagination/pagination.class';
import { setNestedOptions } from 'src/common/utils/set-nested-options.util';
import { HashingService } from 'src/iam/hashing/hashing.service';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { ResourceTrackerService } from 'src/resource/resource-tracker.service';
import { ResourceService } from 'src/resource/resource.service';
import { UsersService } from 'src/users/users.service';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { EmployeeChangePasswordDto } from './dto/employee-change-password.dto';
import { EmployeeQueryDto } from './dto/employee-query.dto';
import { EmployeeUserCreateDto } from './dto/employee-user-create.dto';
import { EmployeeUserUpdateDto } from './dto/employee-user-update.dto';
import { Employee } from './entities/employee.entity';
import { changePasswordUtil } from './utils/change-password.util';
import { createEntityUtil } from './utils/create-entity.util';
import { deleteEntityUtil } from './utils/delete-entity.util';
import { loadQueryBuilder } from './utils/load-query-builder.util';
import { updateEntityUtil } from './utils/update-entity.util';

@Injectable()
export class EmployeesService
{
    constructor (
        @InjectRepository(Employee)
        public readonly repository: Repository<Employee>,
        @Inject(forwardRef(() => UsersService))
        public readonly usersService: UsersService,
        public readonly organizationsService: OrganizationsService,
        public readonly resourceService: ResourceService,
        public readonly resourceTrackerService: ResourceTrackerService,
        public readonly hashingService: HashingService,
    ) { }


    create
        (
            dto: EmployeeUserCreateDto,
            activeUser: ActiveUserData,
        )
    {
        return createEntityUtil(this, dto, activeUser);
    }


    findAll
        (
            options: FindManyOptions<Employee>,
            activeUser: ActiveUserData,
        )
    {
        if (!activeUser.systemAdmin)
        {
            const orgOption: FindManyOptions<Employee> = {
                where: {
                    user: {
                        organization: {
                            id: activeUser.orgId
                        }
                    }
                }
            };

            setNestedOptions(options ??= {}, orgOption);
        }

        return this.repository.find(options);
    }


    async findAllWithFilters
        (
            queryDto: EmployeeQueryDto,
            activeUser: ActiveUserData,
        )
    {
        const loadedQueryBuilder = loadQueryBuilder(
            this.repository,
            queryDto,
            activeUser,
        );

        const [ data, total ] = await loadedQueryBuilder.getManyAndCount();
        const paginationMeta = new PaginationMeta(queryDto.page, queryDto.pageSize, total);

        return new Pagination<Employee>(data, paginationMeta);
    }


    async findOne
        (
            options: FindOneOptions<Employee>,
            activeUser: ActiveUserData,
        )
    {
        if (!activeUser.systemAdmin)
        {
            const orgOption: FindOneOptions<Employee> = {
                where: {
                    user: {
                        organization: {
                            id: activeUser.orgId
                        }
                    }
                }
            };

            setNestedOptions(options ??= {}, orgOption);
        }

        const entity = await this.repository.findOne(options);
        if (!entity)
        {
            throw new NotFoundException(`${Employee.name} not found`);
        }

        return entity;
    }


    update
        (
            id: number,
            dto: EmployeeUserUpdateDto,
            activeUser: ActiveUserData,
        )
    {
        return updateEntityUtil(this, id, dto, activeUser);
    }


    remove
        (
            id: number,
            activeUser: ActiveUserData,
        )
    {
        return deleteEntityUtil(this, id, activeUser);
    }


    changePassword
        (
            dto: EmployeeChangePasswordDto,
            activeUser: ActiveUserData,
        )
    {
        return changePasswordUtil(this, dto, activeUser);
    }
}
