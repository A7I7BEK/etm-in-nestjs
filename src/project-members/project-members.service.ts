import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationMeta } from 'src/common/pagination/pagination-meta.class';
import { Pagination } from 'src/common/pagination/pagination.class';
import { EmployeesService } from 'src/employees/employees.service';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ProjectsService } from 'src/projects/projects.service';
import { FindManyOptions, FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { CreateProjectMemberDto } from './dto/create-project-member.dto';
import { ProjectMemberPageFilterDto } from './dto/project-member-page-filter.dto';
import { ProjectMember } from './entities/project-member.entity';
import { createUpdateEntity } from './utils/create-update-entity.util';
import { loadQueryBuilder } from './utils/load-query-builder.util';

@Injectable()
export class ProjectMembersService
{
    constructor (
        @InjectRepository(ProjectMember)
        private readonly _repository: Repository<ProjectMember>,
        private readonly _projectsService: ProjectsService,
        private readonly _employeesService: EmployeesService,
    ) { }


    async create(
        createDto: CreateProjectMemberDto,
        activeUser: ActiveUserData,
    )
    {
        return createUpdateEntity(
            this._projectsService,
            this._employeesService,
            this._repository,
            createDto,
            activeUser,
        );
    }


    findAll(options?: FindManyOptions<ProjectMember>)
    {
        return this._repository.find(options);
    }


    async findAllWithFilters(
        pageFilterDto: ProjectMemberPageFilterDto,
        activeUser: ActiveUserData,
    )
    {
        const loadedQueryBuilder = loadQueryBuilder(
            this._repository,
            pageFilterDto,
            activeUser,
        );

        const [ data, total ] = await loadedQueryBuilder.getManyAndCount();
        const paginationMeta = new PaginationMeta(pageFilterDto.page, pageFilterDto.perPage, total);

        return new Pagination<ProjectMember>(data, paginationMeta);
    }


    async findOne(
        activeUser: ActiveUserData,
        where: FindOptionsWhere<ProjectMember>,
        relations?: FindOptionsRelations<ProjectMember>,
    )
    {
        let entity: ProjectMember;
        if (activeUser.systemAdmin)
        {
            entity = await this._repository.findOne({ where, relations });
        }
        else
        {
            entity = await this._repository.findOne({
                where: {
                    ...where,
                    project: {
                        organization: {
                            id: activeUser.orgId
                        }
                    }
                },
                relations,
            });
        }


        if (!entity)
        {
            throw new NotFoundException(`${ProjectMember.name} not found`);
        }

        return entity;
    }


    async remove(
        id: number,
        activeUser: ActiveUserData,
    )
    {
        const entity = await this.findOne(activeUser, { id });
        return this._repository.remove(entity);
    }
}
