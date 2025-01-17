import { ForbiddenException, Injectable, MethodNotAllowedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationMeta } from 'src/common/pagination/pagination-meta.class';
import { Pagination } from 'src/common/pagination/pagination.class';
import { setNestedOptions } from 'src/common/utils/set-nested-options.util';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { OrganizationPermissions } from 'src/organizations/enums/organization-permissions.enum';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { PermissionPermissions } from 'src/permissions/enums/permission-permissions.enum';
import { PermissionsService } from 'src/permissions/permissions.service';
import { And, Equal, FindManyOptions, FindOneOptions, ILike, Not, Repository } from 'typeorm';
import { ActionCreateDto } from './dto/action-create.dto';
import { ActionQueryDto } from './dto/action-query.dto';
import { ActionUpdateDto } from './dto/action-update.dto';
import { Action } from './entities/action.entity';
import { createUpdateEntity } from './utils/create-update-entity.util';
import { loadQueryBuilder } from './utils/load-query-builder.util';

@Injectable()
export class ActionsService
{
    constructor (
        @InjectRepository(Action)
        public readonly repository: Repository<Action>,
        private readonly _organizationsService: OrganizationsService,
        private readonly _permissionsService: PermissionsService,
    ) { }


    create
        (
            createDto: ActionCreateDto,
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


    findAll
        (
            options: FindManyOptions<Action>,
            activeUser: ActiveUserData,
        )
    {
        if (!activeUser.systemAdmin)
        {
            const orgOption: FindManyOptions<Action> = {
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
            queryDto: ActionQueryDto,
            activeUser: ActiveUserData,
        )
    {
        const loadedQueryBuilder = loadQueryBuilder(
            this.repository,
            queryDto,
            activeUser,
        );

        const [ data, total ] = await loadedQueryBuilder.getManyAndCount();
        const paginationMeta = new PaginationMeta(queryDto.page, queryDto.perPage, total);

        return new Pagination<Action>(data, paginationMeta);
    }


    async findOne
        (
            options: FindOneOptions<Action>,
            activeUser: ActiveUserData,
        )
    {
        if (!activeUser.systemAdmin)
        {
            const orgOption: FindOneOptions<Action> = {
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
            throw new NotFoundException(`${Action.name} not found`);
        }

        return entity;
    }


    async update
        (
            id: number,
            updateDto: ActionUpdateDto,
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

        if (entity.systemCreated)
        {
            throw new ForbiddenException('System created Role cannot be deleted');
        }

        return this.repository.remove(entity);
    }
}
