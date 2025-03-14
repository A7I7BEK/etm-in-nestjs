import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationMeta } from 'src/common/pagination/pagination-meta.class';
import { Pagination } from 'src/common/pagination/pagination.class';
import { setNestedOptions } from 'src/common/utils/set-nested-options.util';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { TasksService } from 'src/tasks/tasks.service';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CheckListGroupCreateDto } from './dto/check-list-group-create.dto';
import { CheckListGroupQueryDto } from './dto/check-list-group-query.dto';
import { CheckListGroupUpdateDto } from './dto/check-list-group-update.dto';
import { CheckListGroup } from './entities/check-list-group.entity';
import { createEntity } from './utils/create-entity.util';
import { deleteEntity } from './utils/delete-entity.util';
import { loadQueryBuilder } from './utils/load-query-builder.util';
import { updateEntity } from './utils/update-entity.util';

@Injectable()
export class CheckListGroupsService
{
    constructor (
        @InjectRepository(CheckListGroup)
        public readonly repository: Repository<CheckListGroup>,
        @Inject(forwardRef(() => TasksService))
        public readonly tasksService: TasksService,
        public readonly eventEmitter: EventEmitter2,
    ) { }


    create
        (
            createDto: CheckListGroupCreateDto,
            activeUser: ActiveUserData,
        )
    {
        return createEntity(this, createDto, activeUser);
    }


    async findAll
        (
            options: FindManyOptions<CheckListGroup>,
            activeUser: ActiveUserData,
        )
    {
        if (!activeUser.systemAdmin)
        {
            const orgOption: FindManyOptions<CheckListGroup> = {
                where: {
                    task: {
                        project: {
                            organization: {
                                id: activeUser.orgId
                            }
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
            queryDto: CheckListGroupQueryDto,
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

        return new Pagination<CheckListGroup>(data, paginationMeta);
    }


    async findOne
        (
            options: FindOneOptions<CheckListGroup>,
            activeUser: ActiveUserData,
        )
    {
        if (!activeUser.systemAdmin)
        {
            const orgOption: FindOneOptions<CheckListGroup> = {
                where: {
                    task: {
                        project: {
                            organization: {
                                id: activeUser.orgId
                            }
                        }
                    }
                }
            };

            setNestedOptions(options ??= {}, orgOption);
        }

        const entity = await this.repository.findOne(options);
        if (!entity)
        {
            throw new NotFoundException(`${CheckListGroup.name} not found`);
        }

        return entity;
    }


    async update
        (
            id: number,
            updateDto: CheckListGroupUpdateDto,
            activeUser: ActiveUserData,
        )
    {
        return updateEntity(this, updateDto, id, activeUser);
    }


    async remove
        (
            id: number,
            activeUser: ActiveUserData,
        )
    {
        return deleteEntity(this, id, activeUser);
    }
}
