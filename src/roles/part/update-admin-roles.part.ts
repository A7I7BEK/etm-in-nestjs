import { RolesService } from '../roles.service';


export async function updateAdminRolesPart
    (
        service: RolesService,
    )
{
    const entityList = await service.repository.find({
        where: { systemCreated: true }
    });


    const adminPermissions = await service.permissionsService.repository.find();
    entityList.forEach(item => { item.permissions = adminPermissions; });


    await service.repository.save(entityList);
}
