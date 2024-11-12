import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderReverse } from 'src/common/pagination/order.enum';
import { PaginationMeta } from 'src/common/pagination/pagination-meta.class';
import { Pagination } from 'src/common/pagination/pagination.class';
import { Brackets, FindManyOptions, FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { OrganizationPageFilterDto } from './dto/organization-page-filter.dto';
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

    findAll(options?: FindManyOptions<Organization>)
    {
        return this.organizationsRepository.find(options);
    }

    async findAllWithFilters(pageFilterDto: OrganizationPageFilterDto)
    {
        const queryBuilder = this.organizationsRepository.createQueryBuilder('org');
        queryBuilder.skip(pageFilterDto.skip);
        queryBuilder.take(pageFilterDto.perPage);
        queryBuilder.orderBy('org.' + pageFilterDto.sortBy, OrderReverse[ pageFilterDto.sortDirection ]);

        if (pageFilterDto.allSearch)
        {
            queryBuilder.andWhere(
                new Brackets((qb) =>
                {
                    qb.orWhere('org.name ILIKE :search', { search: `%${pageFilterDto.allSearch}%` });
                    qb.orWhere('org.email ILIKE :search', { search: `%${pageFilterDto.allSearch}%` });
                }),
            );
        }

        const [ data, total ] = await queryBuilder.getManyAndCount();

        const paginationMeta = new PaginationMeta(pageFilterDto.page, pageFilterDto.perPage, total);

        return new Pagination<Organization>(data, paginationMeta);
    }

    async findOne(where: FindOptionsWhere<Organization>, relations?: FindOptionsRelations<Organization>)
    {
        const entity = await this.organizationsRepository.findOne({ where, relations });

        if (!entity)
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
