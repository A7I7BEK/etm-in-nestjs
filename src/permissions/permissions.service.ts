import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

    findAll()
    {
        return this.permissionsRepository.find();
    }

    async findOne(id: number)
    {
        const entity = await this.permissionsRepository.findOneBy({ id });

        if (!entity)
        {
            throw new NotFoundException();
        }

        return entity;
    }

    async update(id: number, updatePermissionDto: UpdatePermissionDto)
    {
        const entity = await this.findOne(id);

        Object.assign(entity, updatePermissionDto);

        return this.permissionsRepository.save(entity);
    }

    async remove(id: number)
    {
        const entity = await this.findOne(id);
        return this.permissionsRepository.remove(entity);
    }
}
