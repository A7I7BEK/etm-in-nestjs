import { ForbiddenException } from '@nestjs/common';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { RolesService } from '../roles.service';


export async function deleteEntityPart
    (
        service: RolesService,
        id: number,
        activeUser: ActiveUserData,
    )
{
    const entity = await service.findOne(
        {
            where: { id }
        },
        activeUser,
    );


    if (entity.systemCreated)
    {
        throw new ForbiddenException('System created Role cannot be deleted');
    }


    return service.repository.remove(entity);
}
