import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Action } from 'src/actions/entities/action.entity';
import { BaseSimpleEvent } from 'src/actions/event/base-simple.event';
import { PaginationMeta } from 'src/common/pagination/pagination-meta.class';
import { Pagination } from 'src/common/pagination/pagination.class';
import { setNestedOptions } from 'src/common/utils/set-nested-options.util';
import { EmployeesService } from 'src/employees/employees.service';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ProjectsService } from 'src/projects/projects.service';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { ProjectMemberCreateDto } from './dto/project-member-create.dto';
import { ProjectMemberQueryDto } from './dto/project-member-query.dto';
import { ProjectMember } from './entities/project-member.entity';
import { ProjectMemberPermissions } from './enums/project-member-permissions.enum';
import { createEntity } from './utils/create-entity.util';
import { loadQueryBuilder } from './utils/load-query-builder.util';


@Injectable()
export class ProjectMembersService
{
    constructor (
        @InjectRepository(ProjectMember)
        public readonly repository: Repository<ProjectMember>,
        @Inject(forwardRef(() => ProjectsService)) // BINGO: Circular dependency problem solved
        public readonly projectsService: ProjectsService,
        public readonly employeesService: EmployeesService,
        public readonly eventEmitter: EventEmitter2,
    ) { }


    create
        (
            createDto: ProjectMemberCreateDto,
            activeUser: ActiveUserData,
        )
    {
        return createEntity(this, createDto, activeUser);
    }


    findAll
        (
            options: FindManyOptions<ProjectMember>,
            activeUser: ActiveUserData,
        )
    {
        if (!activeUser.systemAdmin)
        {
            const orgOption: FindManyOptions<ProjectMember> = {
                where: {
                    project: {
                        organization: {
                            id: activeUser.orgId
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
            queryDto: ProjectMemberQueryDto,
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

        return new Pagination<ProjectMember>(data, paginationMeta);
    }


    async findOne
        (
            options: FindOneOptions<ProjectMember>,
            activeUser: ActiveUserData,
        )
    {
        if (!activeUser.systemAdmin)
        {
            const orgOption: FindOneOptions<ProjectMember> = {
                where: {
                    project: {
                        organization: {
                            id: activeUser.orgId
                        }
                    }
                }
            };

            setNestedOptions(options ??= {}, orgOption);
        }

        const entity = await this.repository.findOne(options);
        if (!entity)
        {
            throw new NotFoundException(`${ProjectMember.name} not found`);
        }

        return entity;
    }


    async remove
        (
            id: number,
            activeUser: ActiveUserData,
        )
    {
        const entity = await this.findOne(
            {
                where: { id },
                relations: {
                    employee: true,
                    project: true,
                }
            },
            activeUser,
        );
        await this.repository.remove(entity);

        entity.id = id;
        const actionData: BaseSimpleEvent<ProjectMember> = {
            entity: structuredClone(entity),
            activeUser,
        };
        this.eventEmitter.emit(
            [ Action.name, ProjectMemberPermissions.DELETE ],
            actionData
        );

        return entity;
    }
}
