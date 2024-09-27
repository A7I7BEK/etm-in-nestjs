import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from 'src/organizations/entities/organization.entity';
import { Permission } from 'src/permissions/entities/permission.entity';
import { In, Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService
{
    constructor (
        @InjectRepository(Role)
        private readonly rolesRepository: Repository<Role>,
        @InjectRepository(Permission)
        private readonly permissionsRepository: Repository<Permission>,
        @InjectRepository(Organization)
        private readonly organizationsRepository: Repository<Organization>,
    ) { }


    private async manageEntity(dto: CreateRoleDto | UpdateRoleDto, entity: Role = new Role())
    {
        const organizationFound = await this.organizationsRepository.findOneBy({ id: dto.organizationId });

        if (!organizationFound)
        {
            throw new NotFoundException('Organization not found');
        }

        const permissionIds = dto.permissions.map(x => x.id);
        const permissionsFound = await this.permissionsRepository.findBy({ id: In(permissionIds) });

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

    async findOne(id: number)
    {
        const entity = await this.rolesRepository.findOne({
            where: { id },
            relations: { organization: true },
        });

        if (!entity)
        {
            throw new NotFoundException();
        }

        return entity;
    }

    async update(id: number, updateRoleDto: UpdateRoleDto)
    {
        const entity = await this.findOne(id);
        return this.manageEntity(updateRoleDto, entity);
    }

    async remove(id: number)
    {
        const entity = await this.findOne(id);
        return this.rolesRepository.remove(entity);
    }
}
