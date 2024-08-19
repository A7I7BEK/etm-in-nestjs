import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { REQUEST_USER_KEY } from 'src/iam/iam.constants';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { PermissionType } from '../permission.type';
import { Permission } from 'src/permissions/entities/permission.entity';

@Injectable()
export class PermissionsGuard implements CanActivate
{
    constructor (
        private readonly reflector: Reflector,
    ) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>
    {
        const contextPermissions = this.reflector.getAllAndOverride<PermissionType[]>(PERMISSIONS_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!contextPermissions)
        {
            return true;
        }

        const user: ActiveUserData = context.switchToHttp().getRequest()[ REQUEST_USER_KEY ];
        const permissions = [ ...new Set(user.roles.reduce<Permission[]>((total, current) => [ ...total, ...current.permissions ], [])) ];
        const permissionCodeNames = permissions.map(item => item.codeName);

        return contextPermissions.every(permission => permissionCodeNames.includes(permission));
    }
}
