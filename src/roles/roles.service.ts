import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationMeta } from 'src/common/pagination/pagination-meta.class';
import { Pagination } from 'src/common/pagination/pagination.class';
import { setNestedOptions } from 'src/common/utils/set-nested-options.util';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { PermissionsService } from 'src/permissions/permissions.service';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { RoleCreateDto } from './dto/role-create.dto';
import { RoleQueryDto } from './dto/role-query.dto';
import { RoleUpdateDto } from './dto/role-update.dto';
import { Role } from './entity/role.entity';
import { createUpdateEntityPart } from './part/create-update-entity.part';
import { deleteEntityPart } from './part/delete-entity.part';
import { loadQueryBuilderPart } from './part/load-query-builder.part';
import { updateAdminRolesPart } from './part/update-admin-roles.part';

@Injectable()
export class RolesService
{
    constructor (
        @InjectRepository(Role)
        public readonly repository: Repository<Role>,
        public readonly organizationsService: OrganizationsService,
        public readonly permissionsService: PermissionsService,
    ) { }


    create
        (
            createDto: RoleCreateDto,
            activeUser: ActiveUserData,
        )
    {
        return createUpdateEntityPart(this, createDto, activeUser);
    }


    findAll
        (
            options: FindManyOptions<Role>,
            activeUser: ActiveUserData,
        )
    {
        if (!activeUser.systemAdmin)
        {
            const orgOption: FindManyOptions<Role> = {
                where: {
                    organization: {
                        id: activeUser.orgId
                    }
                }
            };

            setNestedOptions(options ??= {}, orgOption); // BINGO
        }

        return this.repository.find(options);
    }


    async findAllWithFilters
        (
            queryDto: RoleQueryDto,
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

        return new Pagination<Role>(data, paginationMeta);
    }


    async findOne
        (
            options: FindOneOptions<Role>,
            activeUser: ActiveUserData,
        )
    {
        if (!activeUser.systemAdmin)
        {
            const orgOption: FindOneOptions<Role> = {
                where: {
                    organization: {
                        id: activeUser.orgId
                    }
                }
            };

            setNestedOptions(options ??= {}, orgOption); // BINGO
        }

        const entity = await this.repository.findOne(options);
        if (!entity)
        {
            throw new NotFoundException(`${Role.name} not found`);
        }

        return entity;
    }


    async update
        (
            id: number,
            updateDto: RoleUpdateDto,
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


    async updateAdminRoles
        (
            activeUser: ActiveUserData,
        )
    {
        return updateAdminRolesPart(this, activeUser);
    }
}
