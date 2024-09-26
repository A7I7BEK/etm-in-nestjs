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

    async create(createRoleDto: CreateRoleDto)
    {
        const organizationFound = await this.organizationsRepository.findOneByOrFail({ id: createRoleDto.organizationId });

        const permissionIds = createRoleDto.permissions.map(x => x.id);
        const permissionsFound = await this.permissionsRepository.findBy({ id: In(permissionIds) });

        const entity = new Role();
        entity.roleName = createRoleDto.roleName;
        entity.codeName = createRoleDto.codeName;
        entity.organization = organizationFound;
        entity.permissions = permissionsFound;

        return this.rolesRepository.save(entity);
    }

    findAll()
    {
        return this.rolesRepository.find();
    }

    async findOne(id: number)
    {
        const entity = await this.rolesRepository.findOneBy({ id });

        if (!entity)
        {
            throw new NotFoundException();
        }

        return entity;
    }

    async update(id: number, updateRoleDto: UpdateRoleDto)
    {
        const entity = await this.findOne(id);

        Object.assign(entity, updateRoleDto);

        return this.rolesRepository.save(entity);
    }

    async remove(id: number)
    {
        const entity = await this.findOne(id);
        return this.rolesRepository.remove(entity);
    }
}
