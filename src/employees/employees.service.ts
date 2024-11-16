import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationMeta } from 'src/common/pagination/pagination-meta.class';
import { Pagination } from 'src/common/pagination/pagination.class';
import { setNestedOptions } from 'src/common/utils/set-nested-options.util';
import { HashingService } from 'src/iam/hashing/hashing.service';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { ResourceService } from 'src/resource/resource.service';
import { UsersService } from 'src/users/users.service';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { EmployeeChangePasswordDto } from './dto/employee-change-password.dto';
import { EmployeeCreateDto } from './dto/employee-create.dto';
import { EmployeePageFilterDto } from './dto/employee-page-filter.dto';
import { EmployeeUpdateDto } from './dto/employee-update.dto';
import { Employee } from './entities/employee.entity';
import { createUpdateEntity } from './utils/create-update-entity.util';
import { loadQueryBuilder } from './utils/load-query-builder.util';

@Injectable()
export class EmployeesService
{
    constructor (
        @InjectRepository(Employee)
        public readonly repository: Repository<Employee>,
        private readonly _organizationsService: OrganizationsService,
        private readonly _resourceService: ResourceService,
        private readonly _usersService: UsersService,
        private readonly _hashingService: HashingService,
    ) { }


    create
        (
            createDto: EmployeeCreateDto,
            activeUser: ActiveUserData,
        )
    {
        return createUpdateEntity(
            this._organizationsService,
            this._resourceService,
            this._usersService,
            this._hashingService,
            this.repository,
            createDto,
            activeUser,
        );
    }


    findAll
        (
            activeUser: ActiveUserData,
            options?: FindManyOptions<Employee>,
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

            setNestedOptions(options, orgOption);
        }

        return this.repository.find(options);
    }


    async findAllWithFilters
        (
            pageFilterDto: EmployeePageFilterDto,
            activeUser: ActiveUserData,
        )
    {
        const loadedQueryBuilder = loadQueryBuilder(
            this.repository,
            pageFilterDto,
            activeUser,
        );

        const [ data, total ] = await loadedQueryBuilder.getManyAndCount();
        const paginationMeta = new PaginationMeta(pageFilterDto.page, pageFilterDto.perPage, total);

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

            setNestedOptions(options, orgOption);
        }

        const entity = await this.repository.findOne(options);
        if (!entity)
        {
            throw new NotFoundException(`${Employee.name} not found`);
        }

        return entity;
    }


    async update
        (
            id: number,
            updateDto: EmployeeUpdateDto,
            activeUser: ActiveUserData,
        )
    {
        const entity = await this.findOne(
            {
                where: { id },
                relations: { user: true },
            },
            activeUser,
        );

        return createUpdateEntity(
            this._organizationsService,
            this._resourceService,
            this._usersService,
            this._hashingService,
            this.repository,
            updateDto,
            activeUser,
            entity.user,
            entity,
        );
    }


    async remove
        (
            id: number,
            activeUser: ActiveUserData,
        )
    {
        const entity = await this.findOne(
            {
                where: { id },
                relations: { user: true },
            },
            activeUser,
        );


        if (entity.user.id === activeUser.sub)
        {
            throw new ForbiddenException('Cannot delete yourself');
        }


        const entityRemoved = await this.repository.remove(entity);
        await this._usersService.remove(entity.user.id, activeUser);

        return entityRemoved;
    }


    async changePassword
        (
            id: number,
            changePasswordDto: EmployeeChangePasswordDto,
            activeUser: ActiveUserData,
        )
    {
        const entity = await this.findOne(
            {
                where: { id },
                relations: { user: true },
            },
            activeUser,
        );

        entity.user.password = await this._hashingService.hash(changePasswordDto.newPassword);
        await this._usersService.repository.save(entity.user);
    }
}
