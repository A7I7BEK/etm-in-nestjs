import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationMeta } from 'src/common/pagination/pagination-meta.class';
import { Pagination } from 'src/common/pagination/pagination.class';
import { OrganizationPermissions } from 'src/organizations/enums/organization-permissions.enum';
import { ReportPermissions } from 'src/reports/enums/report-permissions.enum';
import { RolePermissions } from 'src/roles/enum/role-permissions.enum';
import { Equal, FindOneOptions, ILike, Not, Or, Repository } from 'typeorm';
import { PermissionQueryDto } from './dto/permission-query.dto';
import { Permission } from './entities/permission.entity';
import { loadQueryBuilder } from './utils/load-query-builder.util';

@Injectable()
export class PermissionsService
{
    constructor (
        @InjectRepository(Permission)
        public readonly repository: Repository<Permission>,
    ) { }


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
        const paginationMeta = new PaginationMeta(queryDto.page, queryDto.pageSize, total);

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


    findAllForAdminRole()
    {
        const [ organizationWord ] = OrganizationPermissions.CREATE.split('_');

        // BINGO: exclude permissions that are not needed for the admin role
        return this.repository.findBy({
            codeName: Not(Or(
                ILike(`${organizationWord}%`),
                Equal(RolePermissions.UPDATE_ADMINS.toString()),
                Equal(ReportPermissions.CHART_TRELLO.toString()),
            )),
        });
    }
}
