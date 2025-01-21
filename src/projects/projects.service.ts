import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationMeta } from 'src/common/pagination/pagination-meta.class';
import { Pagination } from 'src/common/pagination/pagination.class';
import { setNestedOptions } from 'src/common/utils/set-nested-options.util';
import { EmployeesService } from 'src/employees/employees.service';
import { GroupsService } from 'src/groups/groups.service';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { ProjectColumnsService } from 'src/project-columns/project-columns.service';
import { ProjectMembersService } from 'src/project-members/project-members.service';
import { ProjectTagsService } from 'src/project-tags/project-tags.service';
import { ResourceService } from 'src/resource/resource.service';
import { Equal, FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { ProjectBackgroundDto } from './dto/project-background.dto';
import { ProjectCreateDto } from './dto/project-create.dto';
import { ProjectQueryDto } from './dto/project-query.dto';
import { ProjectUpdateDto } from './dto/project-update.dto';
import { Project } from './entities/project.entity';
import { createEntity } from './utils/create-entity.util';
import { getProjectDetails } from './utils/get-project-details.util';
import { loadQueryBuilder } from './utils/load-query-builder.util';
import { updateEntity } from './utils/update-entity.util.ts';

@Injectable()
export class ProjectsService
{
    constructor (
        @InjectRepository(Project)
        public readonly repository: Repository<Project>,
        public readonly organizationsService: OrganizationsService,
        public readonly employeesService: EmployeesService,
        public readonly groupsService: GroupsService,
        @Inject(forwardRef(() => ProjectColumnsService)) // BINGO
        public readonly projectColumnsService: ProjectColumnsService,
        @Inject(forwardRef(() => ProjectMembersService)) // BINGO
        public readonly projectMembersService: ProjectMembersService,
        @Inject(forwardRef(() => ProjectTagsService)) // BINGO
        public readonly projectTagsService: ProjectTagsService,
        public readonly resourceService: ResourceService,
        public readonly eventEmitter: EventEmitter2,
    ) { }


    create
        (
            createDto: ProjectCreateDto,
            activeUser: ActiveUserData,
        )
    {
        return createEntity(this, createDto, activeUser);
    }


    async findAll
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
        return updateEntity(this, id, updateDto, activeUser);
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
                    columns: true,
                    members: true,
                    tags: true,
                },
            },
            activeUser,
        );

        await this.projectColumnsService.repository.remove(entity.columns);
        await this.projectMembersService.repository.remove(entity.members);
        await this.projectTagsService.repository.remove(entity.tags);
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

        const file = await this.resourceService.repository.findOneBy({ url: Equal(entity.background) });
        if (file)
        {
            await this.resourceService.remove(file.id, activeUser);
        }

        entity.background = backgroundDto.background;
        return this.repository.save(entity);
    }


    getAllDetails
        (
            id: number,
            activeUser: ActiveUserData,
        )
    {
        return getProjectDetails(this, id, activeUser);
    }
}
