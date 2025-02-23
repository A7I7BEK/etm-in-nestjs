import { MethodNotAllowedException } from '@nestjs/common';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
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


    const adminPermissions = await service.permissionsService.findAllForAdminRole();
    entityList.forEach(item => { item.permissions = adminPermissions; });


    await service.repository.save(entityList);


    return 1;
}
