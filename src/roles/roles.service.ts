import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import appConfig from 'src/common/config/app.config';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { PermissionsService } from 'src/permissions/permissions.service';
import { FindOptionsRelations, FindOptionsWhere, In, Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
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
    ) { }


    private async manageEntity(dto: CreateRoleDto | UpdateRoleDto, entity: Role = new Role())
    {
        const organizationFound = await this.organizationsService.findOne({ id: dto.organizationId });
        const permissionIds = dto.permissions.map(x => x.id);
        const permissionsFound = await this.permissionsService.findAll({ where: { id: In(permissionIds) } });

        entity.roleName = dto.roleName;
        entity.codeName = dto.codeName;
        entity.organization = organizationFound;
        entity.permissions = permissionsFound;

        return this.rolesRepository.save(entity);
    }

    async create(createRoleDto: CreateRoleDto)
    {
        return this.manageEntity(createRoleDto);
    }

    findAll()
    {
        return this.rolesRepository.find();
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

    async update(id: number, updateRoleDto: UpdateRoleDto)
    {
        const entity = await this.findOne({ id });
        return this.manageEntity(updateRoleDto, entity);
    }

    async remove(id: number)
    {
        const entity = await this.findOne({ id });
        return this.rolesRepository.remove(entity);
    }
}
