import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationMeta } from 'src/common/pagination/pagination-meta.class';
import { Pagination } from 'src/common/pagination/pagination.class';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { PermissionCreateDto } from './dto/permission-create.dto';
import { PermissionQueryDto } from './dto/permission-query.dto';
import { PermissionUpdateDto } from './dto/permission-update.dto';
import { Permission } from './entities/permission.entity';
import { loadQueryBuilder } from './utils/load-query-builder.util';

@Injectable()
export class PermissionsService
{
    constructor (
        @InjectRepository(Permission)
        public readonly repository: Repository<Permission>,
    ) { }


    create
        (
            createDto: PermissionCreateDto,
        )
    {
        const entity = this.repository.create({
            ...createDto
        });
        return this.repository.save(entity);
    }


    findAll
        (
            options: FindManyOptions<Permission>,
        )
    {
        return this.repository.find(options);
    }


    async findAllWithFilters
        (
            queryDto: PermissionQueryDto,
        )
    {
        const loadedQueryBuilder = loadQueryBuilder(
            this.repository,
            queryDto,
        );

        const [ data, total ] = await loadedQueryBuilder.getManyAndCount();
        const paginationMeta = new PaginationMeta(queryDto.page, queryDto.perPage, total);

        return new Pagination<Permission>(data, paginationMeta);
    }


    async findOne
        (
            options: FindOneOptions<Permission>,
        )
    {
        const entity = await this.repository.findOne(options);

        if (!entity)
        {
            throw new NotFoundException(`${Permission.name} not found`);
        }

        return entity;
    }


    async update
        (
            id: number,
            updateDto: PermissionUpdateDto,
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
