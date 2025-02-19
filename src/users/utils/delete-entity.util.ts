import { ForbiddenException } from '@nestjs/common';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { UsersService } from '../users.service';


export async function deleteEntityUtil
    (
        service: UsersService,
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


    if (entity.id === activeUser.sub)
    {
        throw new ForbiddenException('Cannot delete yourself');
    }


    if (entity.marks.registered)
    {
        throw new ForbiddenException('Cannot delete ADMIN user');
    }


    return service.repository.remove(entity);
}
