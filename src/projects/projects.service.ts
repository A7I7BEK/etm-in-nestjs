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
        private readonly rolesRepository: Repository<Project>,
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

        return this.rolesRepository.save(entity);
    }

    async create(createProjectDto: CreateProjectDto, activeUser: ActiveUserData)
    {
        return this.manageEntity(createProjectDto, activeUser);
    }

    findAll(options?: FindManyOptions<Project>)
    {
        return this.rolesRepository.find(options);
    }

    async findAllWithFilters(pageFilterDto: ProjectPageFilterDto, activeUser: ActiveUserData)
    {
        const queryBuilder = this.rolesRepository.createQueryBuilder('role');
        queryBuilder.leftJoinAndSelect('role.organization', 'organization');
        queryBuilder.skip(pageFilterDto.skip);
        queryBuilder.take(pageFilterDto.perPage);
        queryBuilder.orderBy('role.' + pageFilterDto.sortBy, OrderReverse[ pageFilterDto.sortDirection ]);

        if (pageFilterDto.organizationId)
        {
            queryBuilder.andWhere('role.organization = :orgId', { orgId: pageFilterDto.organizationId });
        }
        else
        {
            queryBuilder.andWhere('role.organization = :orgId', { orgId: activeUser.orgId });
        }

        if (pageFilterDto.allSearch)
        {
            queryBuilder.andWhere(
                new Brackets((qb) =>
                {
                    qb.orWhere('role.codeName ILIKE :search', { search: `%${pageFilterDto.allSearch}%` });
                    qb.orWhere('role.roleName ILIKE :search', { search: `%${pageFilterDto.allSearch}%` });
                }),
            );
        }

        const [ data, total ] = await queryBuilder.getManyAndCount();

        const paginationMeta = new PaginationMeta(pageFilterDto.page, pageFilterDto.perPage, total);

        return new Pagination<Project>(data, paginationMeta);
    }

    async findOne(where: FindOptionsWhere<Project>, relations?: FindOptionsRelations<Project>)
    {
        const entity = await this.rolesRepository.findOne({ where, relations });

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
        return this.rolesRepository.remove(entity);
    }
}
