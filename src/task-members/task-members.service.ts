import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationMeta } from 'src/common/pagination/pagination-meta.class';
import { Pagination } from 'src/common/pagination/pagination.class';
import { setNestedOptions } from 'src/common/utils/set-nested-options.util';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { PermissionsService } from 'src/permissions/permissions.service';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { TaskMemberCreateDto } from './dto/task-member-create.dto';
import { TaskMemberQueryDto } from './dto/task-member-query.dto';
import { TaskMemberUpdateDto } from './dto/task-member-update.dto';
import { TaskMember } from './entities/task-member.entity';
import { createUpdateEntity } from './utils/create-update-entity.util';
import { loadQueryBuilder } from './utils/load-query-builder.util';

@Injectable()
export class TaskMembersService
{
    constructor (
        @InjectRepository(TaskMember)
        public readonly repository: Repository<TaskMember>,
        private readonly _organizationsService: OrganizationsService,
        private readonly _permissionsService: PermissionsService,
    ) { }


    create
        (
            createDto: TaskMemberCreateDto,
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
            options: FindManyOptions<TaskMember>,
            activeUser: ActiveUserData,
        )
    {
        if (!activeUser.systemAdmin)
        {
            const orgOption: FindManyOptions<TaskMember> = {
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
            queryDto: TaskMemberQueryDto,
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

        return new Pagination<TaskMember>(data, paginationMeta);
    }


    async findOne
        (
            options: FindOneOptions<TaskMember>,
            activeUser: ActiveUserData,
        )
    {
        if (!activeUser.systemAdmin)
        {
            const orgOption: FindOneOptions<TaskMember> = {
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
            throw new NotFoundException(`${TaskMember.name} not found`);
        }

        return entity;
    }


    async update
        (
            id: number,
            updateDto: TaskMemberUpdateDto,
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
