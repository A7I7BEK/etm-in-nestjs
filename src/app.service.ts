import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { PERMISSION_LIST } from './iam/authorization/permission.constants';
import { PermissionsService } from './permissions/permissions.service';
import { RolesService } from './roles/roles.service';
import { UsersService } from './users/users.service';

@Injectable()
export class AppService implements OnApplicationBootstrap
{
    constructor (
        private readonly _usersService: UsersService,
        private readonly _rolesService: RolesService,
        private readonly _permissionsService: PermissionsService,
    ) { }


    async onApplicationBootstrap()
    {
        await this.insertPermissions();
        await this.updateAdminRoles();
        await this.markUsersOffline();
    }


    async insertPermissions()
    {
        // await this.permissionsRepository.delete({}); // if deleted, roles crash
        // await this.permissionsRepository.upsert(PERMISSION_LIST, [ "codeName" ]); // the same as below 👇

        await this._permissionsService.repository
            .createQueryBuilder()
            .insert()
            .values(PERMISSION_LIST)
            .orIgnore() // BINGO: ignore if the same value exists in the DB
            .execute();
    }


    async updateAdminRoles()
    {
        await this._rolesService.updateAdminRoles();
    }


    async markUsersOffline()
    {
        await this._usersService.repository.update({}, {
            isOnline: false
        });
    }
}
