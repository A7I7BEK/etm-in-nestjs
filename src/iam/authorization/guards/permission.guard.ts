import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessTokenPermissionStorage } from 'src/iam/authentication/storage/access-token-permission.storage';
import { REQUEST_USER_KEY } from 'src/iam/iam.constants';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { PERMISSION_TYPE_KEY, PermissionType } from '../permission.constants';

@Injectable()
export class PermissionGuard implements CanActivate
{
    constructor (
        private readonly _reflector: Reflector,
        private readonly _accTokenPermStorage: AccessTokenPermissionStorage,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean>
    {
        const contextPermissions = this._reflector.getAllAndOverride<PermissionType[]>(PERMISSION_TYPE_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!contextPermissions)
        {
            return true;
        }

        const user: ActiveUserData = context.switchToHttp().getRequest()[ REQUEST_USER_KEY ];

        if (user.systemAdmin)
        {
            return true;
        }

        const permissionCodeNames = await this._accTokenPermStorage.retrieve(user.sub);
        if (!permissionCodeNames)
        {
            return false;
        }

        return contextPermissions.every(permission => permissionCodeNames.includes(permission));
    }
}
