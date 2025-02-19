import { MethodNotAllowedException } from '@nestjs/common';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { OrganizationPermissions } from 'src/organizations/enums/organization-permissions.enum';
import { PermissionPermissions } from 'src/permissions/enums/permission-permissions.enum';
import { And, Equal, ILike, Not } from 'typeorm';
import { RolesService } from '../roles.service';


export async function updateAdminRolesPart
    (
        service: RolesService,
        activeUser: ActiveUserData,
    )
{
    if (!activeUser.systemAdmin)
    {
        throw new MethodNotAllowedException();
    }


    const entityList = await service.repository.find({
        where: { systemCreated: true }
    });


    const [ organizationWord ] = OrganizationPermissions.Create.split('_');
    const adminPermissions = await service.permissionsService.repository.findBy({
        name: Not(ILike(`${organizationWord}%`)),
        codeName: And(
            Not(Equal(PermissionPermissions.Create)),
            Not(Equal(PermissionPermissions.Update)),
            Not(Equal(PermissionPermissions.Delete)),
        ),
    });

    entityList.forEach(item => { item.permissions = adminPermissions; });
    await service.repository.save(entityList);

    return 1;
}
