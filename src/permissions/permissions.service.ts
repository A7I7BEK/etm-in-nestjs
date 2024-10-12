import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionsService
{
    constructor (
        @InjectRepository(Permission)
        private readonly permissionsRepository: Repository<Permission>,
    ) { }

    create(createPermissionDto: CreatePermissionDto)
    {
        const entity = this.permissionsRepository.create({
            ...createPermissionDto
        });
        return this.permissionsRepository.save(entity);
    }

    findAll(options?: FindManyOptions<Permission>)
    {
        return this.permissionsRepository.find(options);
    }

    async findOne(where: FindOptionsWhere<Permission>, relations?: FindOptionsRelations<Permission>)
    {
        const entity = await this.permissionsRepository.findOne({ where, relations });

        if (!entity)
        {
            throw new NotFoundException(`${Permission.name} not found`);
        }

        return entity;
    }

    async update(id: number, updatePermissionDto: UpdatePermissionDto)
    {
        const entity = await this.findOne({ id });

        Object.assign(entity, updatePermissionDto);

        return this.permissionsRepository.save(entity);
    }

    async remove(id: number)
    {
        const entity = await this.findOne({ id });
        return this.permissionsRepository.remove(entity);
    }
}
