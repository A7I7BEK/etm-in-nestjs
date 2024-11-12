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
        await this.insertPermissions();
    }

    async insertPermissions()
    {
        try
        {
            const permissions = permissionList.map(perm => ({
                name: perm,
                codeName: perm,
            }));

            // await this.permissionsRepository.delete({}); // if deleted, roles crash
            // await this.permissionsRepository.upsert(permissions, [ "codeName" ]); // the same as below 👇

            await this.permissionsRepository
                .createQueryBuilder()
                .insert()
                .values(permissions)
                .orIgnore() // BINGO
                .execute();
        }
        catch (error)
        {
            console.log('PERMISSION_CREATION --->', error);
        }
    }
}
