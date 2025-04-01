import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { EmployeesService } from '../employees.service';


export async function deleteEntityUtil
    (
        service: EmployeesService,
        id: number,
        activeUser: ActiveUserData,
    )
{
    const entity = await service.findOne(
        {
            where: { id },
            relations: { user: true },
        },
        activeUser,
    );


    await service.usersService.remove(entity.user.id, activeUser);


    if (entity.photoFile)
    {
        await service.resourceService.removeSelf(entity.photoFile);
    }


    return entity;
}
