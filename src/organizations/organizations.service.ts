import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationMeta } from 'src/common/pagination/pagination-meta.class';
import { Pagination } from 'src/common/pagination/pagination.class';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { OrganizationCreateDto } from './dto/organization-create.dto';
import { OrganizationPageFilterDto } from './dto/organization-page-filter.dto';
import { OrganizationUpdateDto } from './dto/organization-update.dto';
import { Organization } from './entities/organization.entity';
import { loadQueryBuilder } from './utils/load-query-builder.util';

@Injectable()
export class OrganizationsService
{
    constructor (
        @InjectRepository(Organization)
        public readonly repository: Repository<Organization>,
    ) { }


    create
        (
            createDto: OrganizationCreateDto,
        )
    {
        const entity = this.repository.create({
            ...createDto
        });
        return this.repository.save(entity);
    }


    findAll
        (
            options: FindManyOptions<Organization>,
        )
    {
        return this.repository.find(options);
    }


    async findAllWithFilters
        (
            pageFilterDto: OrganizationPageFilterDto,
        )
    {
        const loadedQueryBuilder = loadQueryBuilder(
            this.repository,
            pageFilterDto,
        );

        const [ data, total ] = await loadedQueryBuilder.getManyAndCount();
        const paginationMeta = new PaginationMeta(pageFilterDto.page, pageFilterDto.perPage, total);

        return new Pagination<Organization>(data, paginationMeta);
    }


    async findOne
        (
            options: FindOneOptions<Organization>,
        )
    {
        const entity = await this.repository.findOne(options);

        if (!entity)
        {
            throw new NotFoundException(`${Organization.name} not found`);
        }

        return entity;
    }


    async update
        (
            id: number,
            updateDto: OrganizationUpdateDto,
        )
    {
        const entity = await this.findOne({ where: { id } });

        Object.assign(entity, updateDto);

        return this.repository.save(entity);
    }


    async remove
        (
            id: number,
        )
    {
        const entity = await this.findOne({ where: { id } });
        return this.repository.remove(entity);
    }
}
