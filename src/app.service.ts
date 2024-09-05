import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { permissionList } from './iam/authorization/permission.constants';
import { Permission } from './permissions/entities/permission.entity';

@Injectable()
export class AppService implements OnApplicationBootstrap
{
    constructor (
        @InjectRepository(Permission)
        private readonly permissionsRepository: Repository<Permission>,
    ) { }

    async onApplicationBootstrap()
    {
        await this.clearAndInsertPermissions();
    }

    async clearAndInsertPermissions()
    {
        const permissions = permissionList.map(perm => ({
            name: perm,
            codeName: perm,
        }));

        try
        {
            await this.permissionsRepository.delete({});
            await this.permissionsRepository
                .createQueryBuilder()
                .insert()
                .values(permissions)
                .orIgnore()
                .execute();
        }
        catch (error)
        {
            console.log('PERMISSION_INSERT', error);
        }
    }
}
