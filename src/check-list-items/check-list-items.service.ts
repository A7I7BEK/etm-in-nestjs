import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { CheckListGroupsService } from 'src/check-list-groups/check-list-groups.service';
import { PaginationMeta } from 'src/common/pagination/pagination-meta.class';
import { Pagination } from 'src/common/pagination/pagination.class';
import { setNestedOptions } from 'src/common/utils/set-nested-options.util';
import { EmployeesService } from 'src/employees/employees.service';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { TasksService } from 'src/tasks/tasks.service';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CheckListItemCreateDto } from './dto/check-list-item-create.dto';
import { CheckListItemQueryDto } from './dto/check-list-item-query.dto';
import { CheckListItemUpdateDto } from './dto/check-list-item-update.dto';
import { CheckListItem } from './entities/check-list-item.entity';
import { createEntity } from './utils/create-entity.util';
import { deleteEntity } from './utils/delete-entity.util';
import { loadQueryBuilder } from './utils/load-query-builder.util';
import { updateEntity } from './utils/update-entity.util';


@Injectable()
export class CheckListItemsService
{
    constructor (
        @InjectRepository(CheckListItem)
        public readonly repository: Repository<CheckListItem>,
        public readonly chGroupsService: CheckListGroupsService,
        public readonly employeesService: EmployeesService,
        public readonly tasksService: TasksService,
        public readonly eventEmitter: EventEmitter2,
    ) { }


    create
        (
            createDto: CheckListItemCreateDto,
            activeUser: ActiveUserData,
        )
    {
        return createEntity(this, createDto, activeUser);
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
        const paginationMeta = new PaginationMeta(queryDto.page, queryDto.pageSize, total);

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
