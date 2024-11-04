import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import appConfig from 'src/common/config/app.config';
import { OrderReverse } from 'src/common/pagination/order.enum';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { Organization } from 'src/organizations/entities/organization.entity';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { PermissionsService } from 'src/permissions/permissions.service';
import { UsersService } from 'src/users/users.service';
import { Brackets, FindManyOptions, FindOptionsRelations, FindOptionsWhere, In, Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { RolePageFilterDto } from './dto/role-page-filter.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService
{
    constructor (
        @InjectRepository(Role)
        private readonly rolesRepository: Repository<Role>,
        private readonly organizationsService: OrganizationsService,
        private readonly permissionsService: PermissionsService,
        @Inject(forwardRef(() => UsersService)) // BINGO
        private readonly usersService: UsersService,
    ) { }


    private async manageEntity(
        dto: CreateRoleDto | UpdateRoleDto,
        activeUser: ActiveUserData,
        entity = new Role(),
    )
    {
        let organizationEntity: Organization;
        if (dto.organizationId)
        {
            organizationEntity = await this.organizationsService.findOne({ id: dto.organizationId });
        }
        else
        {
            const activeUserEntity = await this.usersService.findOne(
                { id: activeUser.sub },
                { organization: true },
            );

            organizationEntity = activeUserEntity.organization;
        }

        const permissionIds = dto.permissions.map(x => x.id);
        const permissionsFound = await this.permissionsService.findAll({ where: { id: In(permissionIds) } }); // BINGO

        entity.roleName = dto.roleName;
        entity.codeName = dto.codeName;
        entity.organization = organizationEntity;
        entity.permissions = permissionsFound;

        return this.rolesRepository.save(entity);
    }

    async create(createRoleDto: CreateRoleDto, activeUser: ActiveUserData)
    {
        return this.manageEntity(createRoleDto, activeUser);
    }

    findAll(options?: FindManyOptions<Role>)
    {
        return this.rolesRepository.find(options);
    }

    findAllWithFilters(pageFilterDto: RolePageFilterDto, activeUser: ActiveUserData)
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

        return queryBuilder.getManyAndCount();
    }

    async findOne(where: FindOptionsWhere<Role>, relations?: FindOptionsRelations<Role>)
    {
        const entity = await this.rolesRepository.findOne({ where, relations });

        if (!entity || entity.codeName === appConfig().admin.roleName) // Don't show system role
        {
            throw new NotFoundException(`${Role.name} not found`);
        }

        return entity;
    }

    async update(id: number, updateRoleDto: UpdateRoleDto, activeUser: ActiveUserData)
    {
        const entity = await this.findOne({ id });
        return this.manageEntity(updateRoleDto, activeUser, entity);
    }

    async remove(id: number)
    {
        const entity = await this.findOne({ id });
        return this.rolesRepository.remove(entity);
    }
}
