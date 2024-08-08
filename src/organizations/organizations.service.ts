import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrganizationsService
{
    constructor (
        @InjectRepository(Organization)
        private readonly organizationsRepository: Repository<Organization>,
    ) { }

    create(createOrganizationDto: CreateOrganizationDto)
    {
        const entity = this.organizationsRepository.create({
            ...createOrganizationDto
        });
        return this.organizationsRepository.save(entity);
    }

    findAll()
    {
        return this.organizationsRepository.find();
    }

    async findOne(id: number)
    {
        const entity = await this.organizationsRepository.findOneBy({ id });

        if (!entity)
        {
            throw new NotFoundException();
        }

        return entity;
    }

    async update(id: number, updateOrganizationDto: UpdateOrganizationDto)
    {
        const entity = await this.findOne(id);

        Object.assign(entity, updateOrganizationDto);

        return this.organizationsRepository.save(entity);
    }

    async remove(id: number)
    {
        const entity = await this.findOne(id);
        return this.organizationsRepository.remove(entity);
    }
}
