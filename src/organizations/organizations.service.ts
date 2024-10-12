import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import appConfig from 'src/common/config/app.config';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization } from './entities/organization.entity';

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

    async findOne(where: FindOptionsWhere<Organization>, relations?: FindOptionsRelations<Organization>)
    {
        const entity = await this.organizationsRepository.findOne({ where, relations });

        if (!entity || entity.name === appConfig().admin.orgName) // Don't show system organization
        {
            throw new NotFoundException(`${Organization.name} not found`);
        }

        return entity;
    }

    async update(id: number, updateOrganizationDto: UpdateOrganizationDto)
    {
        const entity = await this.findOne({ id });

        Object.assign(entity, updateOrganizationDto);

        return this.organizationsRepository.save(entity);
    }

    async remove(id: number)
    {
        const entity = await this.findOne({ id });
        return this.organizationsRepository.remove(entity);
    }
}
