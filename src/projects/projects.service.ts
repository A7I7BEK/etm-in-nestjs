import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationMeta } from 'src/common/pagination/pagination-meta.class';
import { Pagination } from 'src/common/pagination/pagination.class';
import { setNestedOptions } from 'src/common/utils/set-nested-options.util';
import { EmployeesService } from 'src/employees/employees.service';
import { GroupsService } from 'src/groups/groups.service';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { ResourceService } from 'src/resource/resource.service';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { ProjectBackgroundDto } from './dto/project-background.dto';
import { ProjectCreateDto } from './dto/project-create.dto';
import { ProjectQueryDto } from './dto/project-query.dto';
import { ProjectUpdateDto } from './dto/project-update.dto';
import { Project } from './entities/project.entity';
import { ProjectType } from './enums/project-type';
import { createUpdateEntity } from './utils/create-update-entity.util';
import { loadQueryBuilder } from './utils/load-query-builder.util';

@Injectable()
export class ProjectsService
{
    constructor (
        @InjectRepository(Project)
        public readonly repository: Repository<Project>,
        private readonly _organizationsService: OrganizationsService,
        private readonly _groupsService: GroupsService,
        private readonly _employeesService: EmployeesService,
        private readonly _resourceService: ResourceService,
    ) { }


    create
        (
            createDto: ProjectCreateDto,
            activeUser: ActiveUserData,
        )
    {
        return createUpdateEntity(
            this._organizationsService,
            this._groupsService,
            this._employeesService,
            this.repository,
            createDto,
            activeUser,
        );
    }


    findAll
        (
            options: FindManyOptions<Project>,
            activeUser: ActiveUserData,
        )
    {
        if (!activeUser.systemAdmin)
        {
            const orgOption: FindManyOptions<Project> = {
                where: {
                    organization: {
                        id: activeUser.orgId
                    }
                }
            };

            setNestedOptions(options ??= {}, orgOption);
        }

        return this.repository.find(options);
    }


    async findAllWithFilters
        (
            queryDto: ProjectQueryDto,
            activeUser: ActiveUserData,
        )
    {
        const loadedQueryBuilder = loadQueryBuilder(
            this.repository,
            queryDto,
            activeUser,
        );

        const [ data, total ] = await loadedQueryBuilder.getManyAndCount();
        data.forEach(entity =>
        {
            if (entity.projectType === ProjectType.KANBAN)
            {
                Object.assign(entity, {
                    percent: 100, // TODO: calculate percentage of tasks in the "Archive" column
                });
            }
        });
        const paginationMeta = new PaginationMeta(queryDto.page, queryDto.perPage, total);

        return new Pagination<Project>(data, paginationMeta);
    }


    async findOne
        (
            options: FindOneOptions<Project>,
            activeUser: ActiveUserData,
        )
    {
        if (!activeUser.systemAdmin)
        {
            const orgOption: FindOneOptions<Project> = {
                where: {
                    organization: {
                        id: activeUser.orgId
                    }
                }
            };

            setNestedOptions(options ??= {}, orgOption);
        }

        const entity = await this.repository.findOne(options);
        if (!entity)
        {
            throw new NotFoundException(`${Project.name} not found`);
        }

        return entity;
    }


    async update
        (
            id: number,
            updateDto: ProjectUpdateDto,
            activeUser: ActiveUserData,
        )
    {
        const entity = await this.findOne(
            {
                where: { id }
            },
            activeUser,
        );

        return createUpdateEntity(
            this._organizationsService,
            this._groupsService,
            this._employeesService,
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
        return this.repository.remove(entity);
    }


    async changeBackground
        (
            backgroundDto: ProjectBackgroundDto,
            activeUser: ActiveUserData,
        )
    {
        const entity = await this.findOne(
            {
                where: { id: backgroundDto.projectId }
            },
            activeUser,
        );

        const file = await this._resourceService.findOne({ url: entity.background });
        await this._resourceService.remove(file.id);

        entity.background = backgroundDto.background;
        return this.repository.save(entity);
    }
}
