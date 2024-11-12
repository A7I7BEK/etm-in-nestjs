import { ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationMeta } from 'src/common/pagination/pagination-meta.class';
import { Pagination } from 'src/common/pagination/pagination.class';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { PermissionsService } from 'src/permissions/permissions.service';
import { UsersService } from 'src/users/users.service';
import { FindManyOptions, FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
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
        private readonly _repository: Repository<Role>,
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
            this._repository,
            createDto,
            activeUser,
        );
    }

    findAll(options?: FindManyOptions<Role>)
    {
        return this._repository.find(options);
    }

    async findAllWithFilters(
        pageFilterDto: RolePageFilterDto,
        activeUser: ActiveUserData,
    )
    {
        const queryBuilder = loadQueryBuilder(
            this._repository,
            pageFilterDto,
            activeUser,
        );

        const [ data, total ] = await queryBuilder.getManyAndCount();
        const paginationMeta = new PaginationMeta(pageFilterDto.page, pageFilterDto.perPage, total);

        return new Pagination<Role>(data, paginationMeta);
    }

    async findOne(
        activeUser: ActiveUserData,
        where: FindOptionsWhere<Role>,
        relations?: FindOptionsRelations<Role>,
    )
    {
        let entity: Role;
        if (activeUser.systemAdmin)
        {
            entity = await this._repository.findOne({ where, relations });
        }
        else
        {
            entity = await this._repository.findOne({
                where: {
                    ...where,
                    organization: {
                        id: activeUser.orgId
                    }
                },
                relations,
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
        const entity = await this.findOne(activeUser, { id });

        if (entity.systemCreated)
        {
            throw new ForbiddenException('System created Role cannot be edited');
        }

        return createUpdateEntity(
            this._organizationsService,
            this._permissionsService,
            this._repository,
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
        const entity = await this.findOne(activeUser, { id });

        if (entity.systemCreated)
        {
            throw new ForbiddenException('System created Role cannot be deleted');
        }

        return this._repository.remove(entity);
    }
}
