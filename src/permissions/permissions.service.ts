import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderReverse } from 'src/common/pagination/order.enum';
import { PaginationMeta } from 'src/common/pagination/pagination-meta.class';
import { Pagination } from 'src/common/pagination/pagination.class';
import { Brackets, FindManyOptions, FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { PermissionPageFilterDto } from './dto/permission-page-filter.dto';
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

    async findAllWithFilters(pageFilterDto: PermissionPageFilterDto)
    {
        const queryBuilder = this.permissionsRepository.createQueryBuilder('perm');
        queryBuilder.skip(pageFilterDto.skip);
        queryBuilder.take(pageFilterDto.perPage);
        queryBuilder.orderBy('perm.' + pageFilterDto.sortBy, OrderReverse[ pageFilterDto.sortDirection ]);

        if (pageFilterDto.allSearch)
        {
            queryBuilder.andWhere(
                new Brackets((qb) =>
                {
                    qb.orWhere('perm.name ILIKE :search', { search: `%${pageFilterDto.allSearch}%` });
                    qb.orWhere('perm.codeName ILIKE :search', { search: `%${pageFilterDto.allSearch}%` });
                }),
            );
        }

        const [ data, total ] = await queryBuilder.getManyAndCount();

        const paginationMeta = new PaginationMeta(pageFilterDto.page, pageFilterDto.perPage, total);

        return new Pagination<Permission>(data, paginationMeta);
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
