import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PERMISSION_LIST } from './iam/authorization/permission.constants';
import { Permission } from './permissions/entities/permission.entity';

@Injectable()
export class AppService implements OnApplicationBootstrap
{
    constructor (
        @InjectRepository(Permission)
        private readonly _permissionsRepository: Repository<Permission>,
    ) { }

    async onApplicationBootstrap()
    {
        await this.insertPermissions();
    }

    async insertPermissions()
    {
        try
        {
            // await this.permissionsRepository.delete({}); // if deleted, roles crash
            // await this.permissionsRepository.upsert(PERMISSION_LIST, [ "codeName" ]); // the same as below 👇

            await this._permissionsRepository
                .createQueryBuilder()
                .insert()
                .values(PERMISSION_LIST)
                .orIgnore() // BINGO
                .execute();
        }
        catch (error)
        {
            console.log('PERMISSION_CREATION --->', error);
        }
    }
}
