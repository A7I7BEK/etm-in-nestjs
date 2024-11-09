import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderReverse } from 'src/common/pagination/order.enum';
import { PaginationMeta } from 'src/common/pagination/pagination-meta.class';
import { Pagination } from 'src/common/pagination/pagination.class';
import { EmployeesService } from 'src/employees/employees.service';
import { GroupsService } from 'src/groups/groups.service';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { Organization } from 'src/organizations/entities/organization.entity';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { Brackets, FindManyOptions, FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectPageFilterDto } from './dto/project-page-filter.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService
{
    constructor (
        @InjectRepository(Project)
        private readonly projectsRepository: Repository<Project>,
        private readonly organizationsService: OrganizationsService,
        private readonly groupsService: GroupsService,
        private readonly employeesService: EmployeesService,
    ) { }


    private async manageEntity(
        dto: CreateProjectDto | UpdateProjectDto,
        activeUser: ActiveUserData,
        entity = new Project(),
    )
    {
        let organizationEntity: Organization;
        if (dto.organizationId)
        {
            organizationEntity = await this.organizationsService.findOne({ id: dto.organizationId });
        }
        else
        {
            organizationEntity = await this.organizationsService.findOne({ id: activeUser.orgId });
        }

        if (dto instanceof CreateProjectDto)
        {
            entity.projectType = dto.projectType;
        }

        const groupEntity = await this.groupsService.findOne({ id: dto.group.id });
        const employeeEntity = await this.employeesService.findOne({ id: dto.manager.id });


        entity.name = dto.name;
        entity.codeName = dto.codeName;
        entity.group = groupEntity;
        entity.manager = employeeEntity;
        entity.organization = organizationEntity;

        return this.projectsRepository.save(entity);
    }

    async create(createProjectDto: CreateProjectDto, activeUser: ActiveUserData)
    {
        return this.manageEntity(createProjectDto, activeUser);
    }

    findAll(options?: FindManyOptions<Project>)
    {
        return this.projectsRepository.find(options);
    }

    async findAllWithFilters(pageFilterDto: ProjectPageFilterDto, activeUser: ActiveUserData)
    {
        const [ project, group, manager, org ] = [ 'project', 'group', 'manager', 'organization' ];

        const queryBuilder = this.projectsRepository.createQueryBuilder(project);
        queryBuilder.leftJoinAndSelect(`${project}.group`, group);
        queryBuilder.leftJoinAndSelect(`${group}.employees`, 'employees');
        queryBuilder.leftJoinAndSelect(`${group}.leader`, 'leader');
        queryBuilder.leftJoinAndSelect(`${project}.manager`, manager);
        queryBuilder.leftJoinAndSelect(`${project}.organization`, org);
        queryBuilder.skip(pageFilterDto.skip);
        queryBuilder.take(pageFilterDto.perPage);
        queryBuilder.orderBy(project + '.' + pageFilterDto.sortBy, OrderReverse[ pageFilterDto.sortDirection ]);

        if (pageFilterDto.projectType)
        {
            queryBuilder.andWhere(`${project}.projectType = :prType`, { prType: pageFilterDto.projectType });
        }

        if (pageFilterDto.groupId)
        {
            queryBuilder.andWhere(`${project}.group = :grId`, { grId: pageFilterDto.groupId });
        }

        if (pageFilterDto.managerId)
        {
            queryBuilder.andWhere(`${project}.manager = :manId`, { manId: pageFilterDto.managerId });
        }

        if (pageFilterDto.organizationId)
        {
            queryBuilder.andWhere(`${project}.organization = :orgId`, { orgId: pageFilterDto.organizationId });
        }
        else
        {
            queryBuilder.andWhere(`${project}.organization = :orgId`, { orgId: activeUser.orgId });
        }

        if (pageFilterDto.allSearch)
        {
            queryBuilder.andWhere(
                new Brackets((qb) =>
                {
                    qb.orWhere(`${project}.name ILIKE :search`, { search: `%${pageFilterDto.allSearch}%` });
                    qb.orWhere(`${project}.codeName ILIKE :search`, { search: `%${pageFilterDto.allSearch}%` });
                    qb.orWhere(`${group}.name ILIKE :search`, { search: `%${pageFilterDto.allSearch}%` });
                    qb.orWhere(`${manager}.firstName ILIKE :search`, { search: `%${pageFilterDto.allSearch}%` });
                    qb.orWhere(`${manager}.lastName ILIKE :search`, { search: `%${pageFilterDto.allSearch}%` });
                    qb.orWhere(`${manager}.middleName ILIKE :search`, { search: `%${pageFilterDto.allSearch}%` });
                }),
            );
        }

        const [ data, total ] = await queryBuilder.getManyAndCount();

        const paginationMeta = new PaginationMeta(pageFilterDto.page, pageFilterDto.perPage, total);

        return new Pagination<Project>(data, paginationMeta);
    }

    async findOne(where: FindOptionsWhere<Project>, relations?: FindOptionsRelations<Project>)
    {
        const entity = await this.projectsRepository.findOne({ where, relations });

        if (!entity)
        {
            throw new NotFoundException(`${Project.name} not found`);
        }

        return entity;
    }

    async update(id: number, updateProjectDto: UpdateProjectDto, activeUser: ActiveUserData)
    {
        const entity = await this.findOne({ id });
        return this.manageEntity(updateProjectDto, activeUser, entity);
    }

    async remove(id: number)
    {
        const entity = await this.findOne({ id });
        return this.projectsRepository.remove(entity);
    }
}
