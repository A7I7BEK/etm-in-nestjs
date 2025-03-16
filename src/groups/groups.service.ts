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
import { GroupQueryDto } from './dto/group-query.dto';
import { GroupUpdateDto } from './dto/group-update.dto';
import { Group } from './entities/group.entity';
import { createUpdateEntityPart } from './part/create-update-entity.part';
import { deleteEntityPart } from './part/delete-entity.part';
import { loadQueryBuilderPart } from './part/load-query-builder.part';

@Injectable()
export class GroupsService
{
    constructor (
        @InjectRepository(Group)
        public readonly repository: Repository<Group>,
        public readonly organizationsService: OrganizationsService,
        public readonly employeesService: EmployeesService,
    ) { }


    create
        (
            createDto: GroupCreateDto,
            activeUser: ActiveUserData,
        )
    {
        return createUpdateEntityPart(this, createDto, activeUser);
    }


    findAll
        (
            options: FindManyOptions<Group>,
            activeUser: ActiveUserData,
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

            setNestedOptions(options ??= {}, orgOption);
        }

        return this.repository.find(options);
    }


    async findAllWithFilters
        (
            queryDto: GroupQueryDto,
            activeUser: ActiveUserData,
        )
    {
        const loadedQueryBuilder = loadQueryBuilderPart(
            this.repository,
            queryDto,
            activeUser,
        );

        const [ data, total ] = await loadedQueryBuilder.getManyAndCount();
        const paginationMeta = new PaginationMeta(queryDto.page, queryDto.pageSize, total);

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

            setNestedOptions(options ??= {}, orgOption);
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
        return createUpdateEntityPart(this, updateDto, activeUser, id);
    }


    async remove
        (
            id: number,
            activeUser: ActiveUserData,
        )
    {
        return deleteEntityPart(this, id, activeUser);
    }
}
