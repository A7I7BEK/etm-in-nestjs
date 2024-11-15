import { ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationMeta } from 'src/common/pagination/pagination-meta.class';
import { Pagination } from 'src/common/pagination/pagination.class';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { PermissionsService } from 'src/permissions/permissions.service';
import { UsersService } from 'src/users/users.service';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { RolePageFilterDto } from './dto/role-page-filter.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { createUpdateEntity } from './utils/create-update-entity.util';
import { loadQueryBuilder } from './utils/load-query-builder.util';

@Injectable()
export class RolesService
{
    constructor (
        @InjectRepository(Role)
        public readonly repository: Repository<Role>,
        private readonly _organizationsService: OrganizationsService,
        private readonly _permissionsService: PermissionsService,
        @Inject(forwardRef(() => UsersService)) // BINGO
        private readonly _usersService: UsersService,
    ) { }


    async create(
        createDto: CreateRoleDto,
        activeUser: ActiveUserData,
    )
    {
        return createUpdateEntity(
            this._organizationsService,
            this._permissionsService,
            this.repository,
            createDto,
            activeUser,
        );
    }


    findAll(
        activeUser: ActiveUserData,
        options?: FindManyOptions<Role>,
    )
    {
        if (activeUser.systemAdmin)
        {
            return this.repository.find(options);
        }
        else
        {
            return this.repository.find({
                ...options,
                where: {
                    ...options?.where,
                    organization: {
                        id: activeUser.orgId
                    }
                }
            });
        }
    }


    async findAllWithFilters(
        pageFilterDto: RolePageFilterDto,
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

        return new Pagination<Role>(data, paginationMeta);
    }


    async findOne(
        options: FindOneOptions<Role>,
        activeUser: ActiveUserData,
    )
    {
        let entity: Role;
        if (activeUser.systemAdmin)
        {
            entity = await this.repository.findOne(options);
        }
        else
        {
            entity = await this.repository.findOne({
                ...options,
                where: {
                    ...options?.where,
                    organization: {
                        id: activeUser.orgId
                    }
                }
            });
        }


        if (!entity)
        {
            throw new NotFoundException(`${Role.name} not found`);
        }

        return entity;
    }


    async update(
        id: number,
        updateDto: UpdateRoleDto,
        activeUser: ActiveUserData,
    )
    {
        const entity = await this.findOne(
            {
                where: { id }
            },
            activeUser,
        );

        if (entity.systemCreated)
        {
            throw new ForbiddenException('System created Role cannot be edited');
        }

        return createUpdateEntity(
            this._organizationsService,
            this._permissionsService,
            this.repository,
            updateDto,
            activeUser,
            entity,
        );
    }


    async remove(
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

        if (entity.systemCreated)
        {
            throw new ForbiddenException('System created Role cannot be deleted');
        }

        return this.repository.remove(entity);
    }
}
