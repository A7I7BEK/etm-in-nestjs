import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService
{
    constructor (
        @InjectRepository(Role)
        private readonly rolesRepository: Repository<Role>,
    ) { }

    create(createRoleDto: CreateRoleDto)
    {
        const entity = this.rolesRepository.create({
            ...createRoleDto
        });
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
