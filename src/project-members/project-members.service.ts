import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
import { createUpdateEntity } from './utils/create-update-entity.util';
import { loadQueryBuilder } from './utils/load-query-builder.util';

@Injectable()
export class ProjectMembersService
{
    constructor (
        @InjectRepository(ProjectMember)
        public readonly repository: Repository<ProjectMember>,
        private readonly _projectsService: ProjectsService,
        private readonly _employeesService: EmployeesService,
    ) { }


    create
        (
            createDto: ProjectMemberCreateDto,
            activeUser: ActiveUserData,
        )
    {
        return createUpdateEntity(
            this._projectsService,
            this._employeesService,
            this.repository,
            createDto,
            activeUser,
        );
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
        const paginationMeta = new PaginationMeta(queryDto.page, queryDto.perPage, total);

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
                where: { id }
            },
            activeUser,
        );
        return this.repository.remove(entity);
    }
}
