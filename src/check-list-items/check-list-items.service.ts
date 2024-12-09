import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationMeta } from 'src/common/pagination/pagination-meta.class';
import { Pagination } from 'src/common/pagination/pagination.class';
import { setNestedOptions } from 'src/common/utils/set-nested-options.util';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { PermissionsService } from 'src/permissions/permissions.service';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CheckListItemCreateDto } from './dto/check-list-item-create.dto';
import { CheckListItemQueryDto } from './dto/check-list-item-query.dto';
import { CheckListItemUpdateDto } from './dto/check-list-item-update.dto';
import { CheckListItem } from './entities/check-list-item.entity';
import { createUpdateEntity } from './utils/create-update-entity.util';
import { loadQueryBuilder } from './utils/load-query-builder.util';


@Injectable()
export class CheckListItemsService
{
    constructor (
        @InjectRepository(CheckListItem)
        public readonly repository: Repository<CheckListItem>,
        private readonly _organizationsService: OrganizationsService,
        private readonly _permissionsService: PermissionsService,
    ) { }


    create
        (
            createDto: CheckListItemCreateDto,
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
            options: FindManyOptions<CheckListItem>,
            activeUser: ActiveUserData,
        )
    {
        if (!activeUser.systemAdmin)
        {
            const orgOption: FindManyOptions<CheckListItem> = {
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
            queryDto: CheckListItemQueryDto,
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

        return new Pagination<CheckListItem>(data, paginationMeta);
    }


    async findOne
        (
            options: FindOneOptions<CheckListItem>,
            activeUser: ActiveUserData,
        )
    {
        if (!activeUser.systemAdmin)
        {
            const orgOption: FindOneOptions<CheckListItem> = {
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
            throw new NotFoundException(`${CheckListItem.name} not found`);
        }

        return entity;
    }


    async update
        (
            id: number,
            updateDto: CheckListItemUpdateDto,
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
