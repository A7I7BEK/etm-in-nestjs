import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationMeta } from 'src/common/pagination/pagination-meta.class';
import { Pagination } from 'src/common/pagination/pagination.class';
import { setNestedOptions } from 'src/common/utils/set-nested-options.util';
import { EmployeesService } from 'src/employees/employees.service';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { GroupCreateDto } from './dto/group-create.dto';
import { GroupPageFilterDto } from './dto/group-page-filter.dto';
import { GroupUpdateDto } from './dto/group-update.dto';
import { Group } from './entities/group.entity';
import { createUpdateEntity } from './utils/create-update-entity.util';
import { loadQueryBuilder } from './utils/load-query-builder.util';

@Injectable()
export class GroupsService
{
    constructor (
        @InjectRepository(Group)
        public readonly repository: Repository<Group>,
        private readonly _organizationsService: OrganizationsService,
        private readonly _employeesService: EmployeesService,
    ) { }


    create
        (
            createDto: GroupCreateDto,
            activeUser: ActiveUserData,
        )
    {
        return createUpdateEntity(
            this._organizationsService,
            this._employeesService,
            this.repository,
            createDto,
            activeUser,
        );
    }


    findAll
        (
            activeUser: ActiveUserData,
            options?: FindManyOptions<Group>,
        )
    {
        if (!activeUser.systemAdmin)
        {
            const orgOption: FindManyOptions<Group> = {
                where: {
                    organization: {
                        id: activeUser.orgId
                    }
                }
            };

            setNestedOptions(options, orgOption);
        }

        return this.repository.find(options);
    }


    async findAllWithFilters
        (
            pageFilterDto: GroupPageFilterDto,
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

        return new Pagination<Group>(data, paginationMeta);
    }


    async findOne
        (
            options: FindOneOptions<Group>,
            activeUser: ActiveUserData,
        )
    {
        if (!activeUser.systemAdmin)
        {
            const orgOption: FindOneOptions<Group> = {
                where: {
                    organization: {
                        id: activeUser.orgId
                    }
                }
            };

            setNestedOptions(options, orgOption);
        }

        const entity = await this.repository.findOne(options);
        if (!entity)
        {
            throw new NotFoundException(`${Group.name} not found`);
        }

        return entity;
    }


    async update
        (
            id: number,
            updateDto: GroupUpdateDto,
            activeUser: ActiveUserData,
        )
    {
        const entity = await this.findOne(
            {
                where: { id }
            },
            activeUser,
        );

        return createUpdateEntity(
            this._organizationsService,
            this._employeesService,
            this.repository,
            updateDto,
            activeUser,
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
                where: { id }
            },
            activeUser,
        );

        return this.repository.remove(entity);
    }
}
