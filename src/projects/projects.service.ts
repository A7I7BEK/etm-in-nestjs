import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationMeta } from 'src/common/pagination/pagination-meta.class';
import { Pagination } from 'src/common/pagination/pagination.class';
import { EmployeesService } from 'src/employees/employees.service';
import { GroupsService } from 'src/groups/groups.service';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { FindManyOptions, FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectPageFilterDto } from './dto/project-page-filter.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { createUpdateEntity } from './utils/create-update-entity.util';
import { loadQueryBuilder } from './utils/load-query-builder.util';

@Injectable()
export class ProjectsService
{
    constructor (
        @InjectRepository(Project)
        private readonly _repository: Repository<Project>,
        private readonly _organizationsService: OrganizationsService,
        private readonly _groupsService: GroupsService,
        private readonly _employeesService: EmployeesService,
    ) { }


    async create(
        createDto: CreateProjectDto,
        activeUser: ActiveUserData,
    )
    {
        return createUpdateEntity(
            this._organizationsService,
            this._groupsService,
            this._employeesService,
            this._repository,
            createDto,
            activeUser,
        );
    }


    findAll(options?: FindManyOptions<Project>)
    {
        return this._repository.find(options);
    }


    async findAllWithFilters(
        pageFilterDto: ProjectPageFilterDto,
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

        return new Pagination<Project>(data, paginationMeta);
    }


    async findOne(
        activeUser: ActiveUserData,
        where: FindOptionsWhere<Project>,
        relations?: FindOptionsRelations<Project>,
    )
    {
        let entity: Project;
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
            throw new NotFoundException(`${Project.name} not found`);
        }

        return entity;
    }


    async update(
        id: number,
        updateDto: UpdateProjectDto,
        activeUser: ActiveUserData,
    )
    {
        const entity = await this.findOne(activeUser, { id });

        return createUpdateEntity(
            this._organizationsService,
            this._groupsService,
            this._employeesService,
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
        return this._repository.remove(entity);
    }
}
