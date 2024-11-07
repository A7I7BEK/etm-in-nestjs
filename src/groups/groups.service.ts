import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderReverse } from 'src/common/pagination/order.enum';
import { PaginationMeta } from 'src/common/pagination/pagination-meta.class';
import { Pagination } from 'src/common/pagination/pagination.class';
import { EmployeesService } from 'src/employees/employees.service';
import { Employee } from 'src/employees/entities/employee.entity';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { Organization } from 'src/organizations/entities/organization.entity';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { Brackets, FindManyOptions, FindOptionsRelations, FindOptionsWhere, In, Repository } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { GroupPageFilterDto } from './dto/group-page-filter.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './entities/group.entity';

@Injectable()
export class GroupsService
{
    constructor (
        @InjectRepository(Group)
        private readonly groupsRepository: Repository<Group>,
        private readonly organizationsService: OrganizationsService,
        private readonly employeesService: EmployeesService,
    ) { }


    private async manageEntity(
        dto: CreateGroupDto | UpdateGroupDto,
        activeUser: ActiveUserData,
        entity = new Group(),
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

        let leaderEmployee: Employee;
        if (dto.leaderId)
        {
            leaderEmployee = await this.employeesService.findOne({ id: dto.leaderId });
        }

        let employeesFound: Employee[];
        if (dto.userIds)
        {
            const employeeIds = dto.userIds.map(x => x.id);
            employeesFound = await this.employeesService.findAll({ where: { id: In(employeeIds) } });
        }


        entity.name = dto.name;
        entity.employees = employeesFound;
        entity.leader = leaderEmployee;
        entity.organization = organizationEntity;

        return this.groupsRepository.save(entity);
    }

    async create(createGroupDto: CreateGroupDto, activeUser: ActiveUserData)
    {
        return this.manageEntity(createGroupDto, activeUser);
    }

    findAll(options?: FindManyOptions<Group>)
    {
        return this.groupsRepository.find(options);
    }

    async findAllWithFilters(pageFilterDto: GroupPageFilterDto, activeUser: ActiveUserData)
    {
        const [ group, empl, leader, org, ] = [ 'group', 'employee', 'leader', 'organization' ];

        const queryBuilder = this.groupsRepository.createQueryBuilder(group);
        queryBuilder.leftJoinAndSelect(`${group}.employees`, empl);
        queryBuilder.leftJoinAndSelect(`${group}.leader`, leader);
        queryBuilder.leftJoinAndSelect(`${group}.organization`, org);
        queryBuilder.skip(pageFilterDto.skip);
        queryBuilder.take(pageFilterDto.perPage);
        queryBuilder.orderBy(group + '.' + pageFilterDto.sortBy, OrderReverse[ pageFilterDto.sortDirection ]);

        if (pageFilterDto.organizationId)
        {
            queryBuilder.andWhere(`${group}.organization = :orgId`, { orgId: pageFilterDto.organizationId });
        }
        else
        {
            queryBuilder.andWhere(`${group}.organization = :orgId`, { orgId: activeUser.orgId });
        }

        if (pageFilterDto.allSearch)
        {
            queryBuilder.andWhere(
                new Brackets((qb) =>
                {
                    qb.orWhere(`${group}.name ILIKE :search`, { search: `%${pageFilterDto.allSearch}%` });
                }),
            );
        }

        const [ data, total ] = await queryBuilder.getManyAndCount();

        const paginationMeta = new PaginationMeta(pageFilterDto.page, pageFilterDto.perPage, total);

        return new Pagination<Group>(data, paginationMeta);
    }

    async findOne(where: FindOptionsWhere<Group>, relations?: FindOptionsRelations<Group>)
    {
        const entity = await this.groupsRepository.findOne({ where, relations });

        if (!entity)
        {
            throw new NotFoundException(`${Group.name} not found`);
        }

        return entity;
    }

    async update(id: number, updateGroupDto: UpdateGroupDto, activeUser: ActiveUserData)
    {
        const entity = await this.findOne({ id });
        return this.manageEntity(updateGroupDto, activeUser, entity);
    }

    async remove(id: number)
    {
        const entity = await this.findOne({ id });
        return this.groupsRepository.remove(entity);
    }
}
